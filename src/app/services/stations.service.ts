/*
 * trainSpotter
 * Copyright (C) 2021 bart
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { debounceTime, delay, map, switchMap, tap } from "rxjs/operators";
import { SortColumn, SortDirection } from "../directives/ngbd-sortable-header.directive";
import { Station } from "../models/ReisinformatieAPI";
import { SharedDataService } from "./shared-data.service";

/**
 * Station search result for All-Stations Component
 */
interface SearchResult {
	/**Stations search result*/
	stations: Station[];
	/**Number of stations found*/
	total: number;
}

/**
 * All-Stations table state
 * */
interface State {
	/**Number of pages*/
	page: number;
	/**Page size*/
	pageSize: number;
	/**Text to search on*/
	searchTerm: string;
	/**Sort column*/
	sortColumn: SortColumn;
	/**Sort direction*/
	sortDirection: SortDirection;
}

/**
 * Compare data of different columns
 * @param v1 Data column one
 * @param v2 Data column two
 * @returns int Lower, higher or same as
 */
const compare = (v1: string, v2: string) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

/**
 * Sort stations by column and direction
 * @param stations Stations to sort on
 * @param column Column to sort on
 * @param direction Column sort direction
 * @returns Station[] Sorted stations
 */
function sort(stations: Station[], column: SortColumn, direction: string): Station[] {
	if (direction === "" || column === "") {
		return stations;
	} else {
		return [...stations].sort((a, b) => {
			let aColumn = a[column] as string;
			let bColumn = b[column] as string;
			if (column === "namen") {
				aColumn = a.namen.lang;
				bColumn = b.namen.lang;
			}
			const res = compare(aColumn.toString(), bColumn.toString());
			return direction === "asc" ? res : -res;
		});
	}
}

/**
 * Text search on station
 * @param station Station
 * @param term Search term
 * @returns boolean True if one of the properties includes the search term
 */
function matches(station: Station, term: string) {
	return (
		station.namen.lang.toLowerCase().includes(term.toLowerCase()) ||
		station.land.toLowerCase().includes(term.toLowerCase()) ||
		station.EVACode.toString().includes(term) ||
		station.UICCode.toString().includes(term)
	);
}

/**
 * Search and sort stations for the All-Stations Component
 */
@Injectable({
	providedIn: "root",
})
export class StationsService {
	/**Subscribable loading object*/
	private _loading$ = new BehaviorSubject<boolean>(true);
	/**Subscribable search operation*/
	private _search$ = new Subject<void>();
	/**Subscribable stations object*/
	private _stations$ = new BehaviorSubject<Station[]>([]);
	/**Subscribable search result number*/
	private _total$ = new BehaviorSubject<number>(0);

	/**State of the table*/
	private _state: State = {
		page: 1,
		pageSize: 50,
		searchTerm: "",
		sortColumn: "",
		sortDirection: "",
	};

	/**
	 * Defines services
	 * Do a search operation when {@link _search$} receives data
	 * @param sharedDataService Shares data through the application
	 */
	constructor(private sharedDataService: SharedDataService) {
		this._search$
			.pipe(
				tap(() => this._loading$.next(true)),
				debounceTime(200),
				switchMap(() => this._search()),
				delay(200),
				tap(() => this._loading$.next(false))
			)
			.subscribe((result) => {
				this._stations$.next(result.stations);
				this._total$.next(result.total);
			});

		this._search$.next();
	}

	/**Observable stations*/
	get stations$(): Observable<Station[]> {
		return this._stations$.asObservable();
	}
	/**Observable search result number*/
	get total$(): Observable<number> {
		return this._total$.asObservable();
	}
	/**Observable loading status*/
	get loading$(): Observable<boolean> {
		return this._loading$.asObservable();
	}

	/**Number of pages*/
	get page(): number {
		return this._state.page;
	}
	/**Set number of pages*/
	set page(page: number) {
		this._set({ page });
	}

	/**Page size*/
	get pageSize(): number {
		return this._state.pageSize;
	}
	/**Set page size*/
	set pageSize(pageSize: number) {
		this._set({ pageSize });
	}

	/**Current search term*/
	get searchTerm(): string {
		return this._state.searchTerm;
	}
	/**Set search term*/
	set searchTerm(searchTerm: string) {
		this._set({ searchTerm });
	}

	/**Set column to sort*/
	set sortColumn(sortColumn: SortColumn) {
		this._set({ sortColumn });
	}
	/**Set sort direction*/
	set sortDirection(sortDirection: SortDirection) {
		this._set({ sortDirection });
	}
	/**Set a property of {@link _state} and do search*/
	private _set(patch: Partial<State>) {
		Object.assign(this._state, patch);
		this._search$.next();
	}

	/**
	 * Full text search on stations
	 * Get stations, sort stations, filter on search term, update table state
	 * @returns Observable<SearchResult> Stations search result
	 */
	private _search(): Observable<SearchResult> {
		const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

		return this.sharedDataService.getBasicInformationAboutAllStations().pipe(
			map((stations) => {
				// 1. sort
				let stationPayloads = sort(stations.payload, sortColumn, sortDirection);

				// 2. filter
				stationPayloads = stationPayloads.filter((station) => matches(station, searchTerm));
				const total = stationPayloads.length;

				// 3. paginate
				stationPayloads = stationPayloads.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
				return { stations: stationPayloads, total };
			})
		);
	}
}
