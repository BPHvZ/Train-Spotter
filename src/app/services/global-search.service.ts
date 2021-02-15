import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, of, zip } from "rxjs";
import { Station, StationsResponse } from "../models/ReisinformatieAPI";
import { DetailedTrainInformation, TrainInformationResponse } from "../models/VirtualTrainAPI";
import { GlobalSearchResult, GlobalSearchResultType } from "../models/GlobalSearch";
import { map } from "rxjs/operators";
import { SharedDataService } from "./shared-data.service";

@Injectable({
	providedIn: "root",
})
export class GlobalSearchService {
	private _stations: StationsResponse = this.sharedDataService.stations;
	private _trains: DetailedTrainInformation[] = this.sharedDataService.detailedTrainInformation;

	constructor(private sharedDataService: SharedDataService) {}

	globalSearch(term: string): Observable<GlobalSearchResult[]> {
		console.log(term);
		if (term === "") {
			const list: GlobalSearchResult[] = [];
			return of(list);
		}

		return zip(
			this._stations ? of(this._stations) : this.sharedDataService.getBasicInformationAboutAllStations(),
			this._trains ? of(this._trains) : this.sharedDataService.getDetailedInformationAboutActiveTrains()
		).pipe(
			map((value) => {
				this._stations = value[0];
				this._trains = value[1];
				return this._searchAllCategories(term);
			})
		);
	}

	private _searchAllCategories(term: string): GlobalSearchResult[] {
		const results: GlobalSearchResult[] = [];

		const stations = this._stations.payload.filter(
			(station) =>
				station.namen.lang.toUpperCase().includes(term.toUpperCase()) ||
				station.code.toUpperCase().includes(term.toUpperCase())
		);
		stations.forEach((station) => {
			results.push({
				result: station,
				searchField: station.namen.lang,
				resultType: GlobalSearchResultType.Station,
			});
		});

		if (!isNaN(Number(term))) {
			const trainsRideIds = this._trains.filter((train) => train.ritId?.includes(term));
			trainsRideIds.forEach((train) => {
				results.push({
					result: train,
					searchField: `Rit: ${train.ritId}`,
					resultType: GlobalSearchResultType.TrainRideId,
				});
			});

			const trainsMaterialNumbers = this._trains.filter((train) =>
				train.trainDetails?.materieeldelen?.some((m) => m.materieelnummer?.toString().includes(term))
			);
			trainsMaterialNumbers.forEach((train) => {
				const trainpart = train.trainDetails.materieeldelen.filter((m) =>
					m.materieelnummer?.toString().includes(term)
				);
				results.push({
					result: train,
					searchField: `Treinstel: ${trainpart[0].materieelnummer}`,
					resultType: GlobalSearchResultType.TrainSetNumber,
				});
			});
		}

		return results;
	}

	searchForStation(term: string): Observable<Station[]> {
		if (term === "") {
			const list: Station[] = [];
			return of(list);
		}

		return this.sharedDataService.stations$.pipe(
			map((response) =>
				response.payload.filter(
					(station) =>
						station.namen.lang.toUpperCase().includes(term.toUpperCase()) ||
						station.code.toUpperCase().includes(term.toUpperCase())
				)
			)
		);
	}
}
