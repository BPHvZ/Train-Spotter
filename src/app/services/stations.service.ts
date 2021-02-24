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

interface SearchResult {
	stations: Station[];
	total: number;
}

interface State {
	page: number;
	pageSize: number;
	searchTerm: string;
	sortColumn: SortColumn;
	sortDirection: SortDirection;
}

const compare = (v1: string, v2: string) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

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

function matches(station: Station, term: string) {
	return (
		station.namen.lang.toLowerCase().includes(term.toLowerCase()) ||
		station.land.toLowerCase().includes(term.toLowerCase()) ||
		station.EVACode.toString().includes(term) ||
		station.UICCode.toString().includes(term)
	);
}

@Injectable({
	providedIn: "root",
})
export class StationsService {
	private _loading$ = new BehaviorSubject<boolean>(true);
	private _search$ = new Subject<void>();
	private _stations$ = new BehaviorSubject<Station[]>([]);
	private _total$ = new BehaviorSubject<number>(0);

	private _state: State = {
		page: 1,
		pageSize: 50,
		searchTerm: "",
		sortColumn: "",
		sortDirection: "",
	};

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

	get stations$(): Observable<Station[]> {
		return this._stations$.asObservable();
	}
	get total$(): Observable<number> {
		return this._total$.asObservable();
	}
	get loading$(): Observable<boolean> {
		return this._loading$.asObservable();
	}

	get page(): number {
		return this._state.page;
	}
	set page(page: number) {
		this._set({ page });
	}

	get pageSize(): number {
		return this._state.pageSize;
	}
	set pageSize(pageSize: number) {
		this._set({ pageSize });
	}

	get searchTerm(): string {
		return this._state.searchTerm;
	}
	set searchTerm(searchTerm: string) {
		this._set({ searchTerm });
	}

	set sortColumn(sortColumn: SortColumn) {
		this._set({ sortColumn });
	}
	set sortDirection(sortDirection: SortDirection) {
		this._set({ sortDirection });
	}

	private _set(patch: Partial<State>) {
		Object.assign(this._state, patch);
		this._search$.next();
	}

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
