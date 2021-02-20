import { Component, ElementRef, ViewChild } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from "rxjs/operators";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { Station } from "../../../models/ReisinformatieAPI";
import { GlobalSearchResult, GlobalSearchResultType } from "../../../models/GlobalSearch";
import { GlobalSearchService } from "../../../services/global-search.service";
import { DetailedTrainInformation, Train } from "../../../models/VirtualTrainAPI";
import { SharedDataService } from "../../../services/shared-data.service";
import { faCrosshairs, faBars } from "@fortawesome/free-solid-svg-icons";

/**
 * Header with links to pages and a dropdown to search for stations
 */
@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.sass"],
})
export class HeaderComponent {
	@ViewChild("globalTypeahead") globalTypeahead: ElementRef;

	navbarOpen = false;

	faCrosshairs = faCrosshairs;
	faBars = faBars;

	searchingStations = false;
	searchStationsFailed = false;

	searchingGlobally = false;
	searchGloballyFailed = false;

	constructor(
		private sharedDataService: SharedDataService,
		private globalSearchService: GlobalSearchService,
		private router: Router
	) {}

	get allDataLoaded(): boolean {
		return this.sharedDataService.allDataLoaded;
	}

	toggleNavbar(): void {
		this.navbarOpen = !this.navbarOpen;
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

	/**
	 * Get the station name from {@link Station.namen}
	 * @param station Station to get the name from
	 * @return The station name
	 */
	formatToStationName(station: Station): string {
		return station.namen.lang;
	}

	/**
	 * Select a station and sent event to train map to fly to it
	 * @param event Selected station from dropdown
	 */
	selectStationFromSearch(event: NgbTypeaheadSelectItemEvent): void {
		event.preventDefault();
		this.sharedDataService.flyToStation(event.item);
	}

	selectItemFromGlobalSearch(event: NgbTypeaheadSelectItemEvent): void {
		event.preventDefault();
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
	}

	/**
	 * Navigate to the stations overview page
	 */
	navigateToAllStations(): void {
		void this.router.navigateByUrl("stations");
	}

	flyToTrainOnMap(train: DetailedTrainInformation): void {
		this.sharedDataService.flyToTrain(train);
	}

	flyToStationOnMap(station: Station): void {
		this.sharedDataService.flyToStation(station);
	}
}
