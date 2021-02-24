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

import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { faBars, faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { Observable, of } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from "rxjs/operators";
import { GlobalSearchResult, GlobalSearchResultType } from "../../../models/GlobalSearch";
import { Station } from "../../../models/ReisinformatieAPI";
import { DetailedTrainInformation } from "../../../models/VirtualTrainAPI";
import { GlobalSearchService } from "../../../services/global-search.service";
import { SharedDataService } from "../../../services/shared-data.service";

/**
 * Header with links to pages and a dropdown to search for stations
 */
@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.sass"],
})
export class HeaderComponent implements OnInit {
	@ViewChild("globalTypeahead") globalTypeahead: ElementRef;

	navbarCollapsed = true;

	faCrosshairs = faCrosshairs;
	faBars = faBars;

	searchingStations = false;
	searchStationsFailed = false;

	searchingGlobally = false;
	searchGloballyFailed = false;

	constructor(private sharedDataService: SharedDataService, private globalSearchService: GlobalSearchService) {}

	ngOnInit(): void {
		this.sharedDataService.navbarCollapsed$.subscribe((value) => {
			this.navbarCollapsed = value;
		});
	}

	get allDataLoaded(): boolean {
		return this.sharedDataService.allDataLoaded;
	}

	toggleNavbar(): void {
		this.sharedDataService.toggleNavbar();
	}

	/**
	 * Search stations on name or abbreviation
	 * @param text$ Input text
	 * @return List of stations
	 */
	searchStations = (text$: Observable<string>): Observable<Station[]> =>
		text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			tap(() => (this.searchingStations = true)),
			switchMap(
				(term: string): Observable<Station[]> =>
					this.globalSearchService.searchForStation(term).pipe(
						tap(() => (this.searchStationsFailed = false)),
						catchError(() => {
							this.searchStationsFailed = true;
							return of([]);
						})
					)
			),
			tap(() => (this.searchingStations = false))
		);

	/**
	 * Search stations on name or abbreviation
	 * @param text$ Input text
	 * @return List of stations
	 */
	searchGlobally = (text$: Observable<string>): Observable<GlobalSearchResult[]> =>
		text$.pipe(
			debounceTime(600),
			distinctUntilChanged(),
			tap(() => (this.searchingGlobally = true)),
			switchMap(
				(term: string): Observable<GlobalSearchResult[]> =>
					this.globalSearchService.globalSearch(term).pipe(
						tap(() => (this.searchGloballyFailed = false)),
						catchError(() => {
							this.searchGloballyFailed = true;
							return of([]);
						})
					)
			),
			tap(() => (this.searchingGlobally = false))
		);

	selectItemFromGlobalSearch(event: NgbTypeaheadSelectItemEvent): void {
		const result = event.item as GlobalSearchResult;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		this.globalTypeahead.nativeElement.value = result.searchField;
		switch (result.resultType) {
			case GlobalSearchResultType.Train: {
				this.sharedDataService.flyToTrain(result.result as DetailedTrainInformation);
				break;
			}
			case GlobalSearchResultType.Station: {
				this.sharedDataService.flyToStation(result.result as Station);
				break;
			}
		}
		this.toggleNavbar();
	}

	flyToTrainOnMap(train: DetailedTrainInformation): void {
		this.sharedDataService.flyToTrain(train);
	}

	flyToStationOnMap(station: Station): void {
		this.sharedDataService.flyToStation(station);
	}
}
