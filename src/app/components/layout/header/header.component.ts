import { Component } from "@angular/core";
import { ApiService } from "../../../services/api.service";
import { Observable, of } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from "rxjs/operators";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { HeaderEventsService } from "../../../services/header-events.service";
import { Router } from "@angular/router";
import { Disruption, Station } from "../../../models/ReisinformatieAPI";
import { GlobalSearchResult, GlobalSearchResultType } from "../../../models/GlobalSearch";
import { GlobalSearchService } from "../../../services/global-search.service";
import { DetailedTrainInformation, Train } from "../../../models/VirtualTrainAPI";
import { SharedDataService } from "../../../services/shared-data.service";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";

/**
 * Header with links to pages and a dropdown to search for stations
 */
@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.sass"],
})
export class HeaderComponent {
	faCrosshairs = faCrosshairs;

	searchingStations = false;
	searchStationsFailed = false;

	searchingGlobally = false;
	searchGloballyFailed = false;

	constructor(
		private sharedDataService: SharedDataService,
		private globalSearchService: GlobalSearchService,
		private headerEventsService: HeaderEventsService,
		private router: Router
	) {}

	get allDataLoaded(): boolean {
		return this.sharedDataService.allDataLoaded;
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
	 * Get the station name from {@link Station.namen}
	 * @param result ResultTemplateContext to get the name from
	 * @return A string to represent the result
	 */
	globalSearchResultFormatter(result: GlobalSearchResult): string {
		switch (result.resultType) {
			case GlobalSearchResultType.Station: {
				const station = result.result as Station;
				return station.namen.lang;
			}
			case GlobalSearchResultType.TrainRideId: {
				const train = result.result as Train;
				return `Rit: ${train.ritId}`;
			}
			case GlobalSearchResultType.TrainSetNumber: {
				return result.searchField as string;
			}
		}
	}

	/**
	 * Select a station and sent event to train map to fly to it
	 * @param event Selected station from dropdown
	 */
	selectStationFromSearch(event: NgbTypeaheadSelectItemEvent): void {
		event.preventDefault();
		this.headerEventsService.selectStation(event.item);
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
