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
import { Observable, of, Subscription } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from "rxjs/operators";
import { GlobalSearchResult, GlobalSearchResultType } from "../../../models/GlobalSearch";
import { Station } from "../../../models/ReisinformatieAPI";
import { DetailedTrainInformation } from "../../../models/VirtualTrainAPI";
import { GlobalSearchService } from "../../../services/global-search.service";
import { SharedDataService } from "../../../services/shared-data.service";

/**
 * Header that is visible on all pages
 */
@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.sass"],
})
export class HeaderComponent implements OnInit {
	/**The global search input field*/
	@ViewChild("globalTypeahead") globalTypeahead: ElementRef;

	/**
	 * Status of the collapsable navbar
	 * Note: only used on smaller screens
	 */
	navbarCollapsed = true;

	/**FontAwesome crosshair icon*/
	faCrosshairs = faCrosshairs;
	/**FontAwesome bars icon*/
	faBars = faBars;

	/**Status of global search*/
	searchingGlobally = false;
	/**Status of failure during global search*/
	searchGloballyFailed = false;

	globalSearchReady = false;
	globalSearchReadySubscription: Subscription;

	/**
	 * Define services
	 * @param sharedDataService Shares data through the application
	 * @param globalSearchService Searches on stations and trains
	 */
	constructor(private sharedDataService: SharedDataService, private globalSearchService: GlobalSearchService) {
		this.globalSearchReadySubscription = this.sharedDataService.globalSearchReady$.subscribe(
			([stations, trains]) => {
				if (stations != null && trains != null) {
					this.globalSearchReady = true;
					this.globalSearchReadySubscription.unsubscribe();
				}
			}
		);
	}

	/**Subscribe to navbar collapse changes*/
	ngOnInit(): void {
		this.sharedDataService.navbarCollapsed$.subscribe((value) => {
			this.navbarCollapsed = value;
		});
	}

	/**Collapse or expand the navbar*/
	toggleNavbar(): void {
		this.sharedDataService.toggleNavbar();
	}

	/**
	 * Full text search on stations and trains
	 * @param text$ Input text
	 * @returns Observable<GlobalSearchResult[]> An Observable of search results
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

	/**
	 * Actions when an search result item is selected
	 * @param event The selected item
	 */
	selectItemFromGlobalSearch(event: NgbTypeaheadSelectItemEvent): void {
		const result = event.item as GlobalSearchResult;
		event.preventDefault();
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

	/**
	 * Fly to a train on the map
	 * @param train The train to fly to
	 */
	flyToTrainOnMap(train: DetailedTrainInformation): void {
		this.sharedDataService.flyToTrain(train);
	}

	/**
	 * Fly to a station on the map
	 * @param station The station to fly to
	 */
	flyToStationOnMap(station: Station): void {
		this.sharedDataService.flyToStation(station);
	}
}
