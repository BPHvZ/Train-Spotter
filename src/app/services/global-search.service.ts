import { Injectable } from "@angular/core";
import { Observable, of, zip } from "rxjs";
import { Station, StationsResponse } from "../models/ReisinformatieAPI";
import { DetailedTrainInformation } from "../models/VirtualTrainAPI";
import { GlobalSearchResult, GlobalSearchResultType } from "../models/GlobalSearch";
import { map } from "rxjs/operators";
import { SharedDataService } from "./shared-data.service";
import { HelperFunctionsService } from "./helper-functions.service";

@Injectable({
	providedIn: "root",
})
export class GlobalSearchService {
	private _stations: StationsResponse = this.sharedDataService.stations;
	private _trains: DetailedTrainInformation[] = this.sharedDataService.detailedTrainInformation;

	constructor(private sharedDataService: SharedDataService, private helperFunctionsService: HelperFunctionsService) {}

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

		if (!isNaN(Number(term))) {
			// Trains on ride id
			const trainsRideIds = this._trains.filter((train) => train.ritId?.includes(term));
			trainsRideIds.forEach((train) => {
				results.push({
					result: train,
					searchField: `Trein ${train.trainDetails?.vervoerder} ${train.trainDetails?.type} ${train.ritId}`,
					resultType: GlobalSearchResultType.Train,
				});
			});

			// Trains on trainpart number
			const trainsMaterialNumbers = this._trains.filter((train) =>
				train.trainDetails?.materieeldelen?.some((m) => m.materieelnummer?.toString().includes(term))
			);
			trainsMaterialNumbers.forEach((train) => {
				const trainpart = train.trainDetails.materieeldelen.filter((m) =>
					m.materieelnummer?.toString().includes(term)
				);
				results.push({
					result: train,
					searchField: `Treinstel ${train.trainDetails?.vervoerder} ${trainpart[0].type} ${trainpart[0].materieelnummer}`,
					resultType: GlobalSearchResultType.Train,
				});
			});
		} else {
			const termUpper = term.toUpperCase();

			// Stations on station name and abbriviation
			const stations = this._stations.payload.filter(
				(station) =>
					station.namen.lang.toUpperCase().includes(termUpper) ||
					station.code.toUpperCase().includes(termUpper)
			);
			stations.forEach((station) => {
				results.push({
					result: station,
					searchField: station.namen.lang,
					resultType: GlobalSearchResultType.Station,
				});
			});

			this._trains.forEach((train) => {
				let searchField: string = null;
				if (this.helperFunctionsService.getTypeOfTrain(train).toUpperCase().includes(termUpper)) {
					const trainType = this.helperFunctionsService.getTypeOfTrain(train);
					searchField = `Trein ${train.trainDetails?.vervoerder} ${trainType} ${train.ritId}`;
				} else if (train.trainDetails?.type?.toUpperCase().includes(termUpper)) {
					searchField = `Trein ${train.trainDetails?.vervoerder} ${train.trainDetails?.type} ${train.ritId}`;
				} else if (train.type?.toUpperCase().includes(termUpper)) {
					searchField = `Trein ${train.trainDetails?.vervoerder} ${train.type} ${train.ritId}`;
				}
				if (searchField) {
					results.push({
						result: train,
						searchField: searchField,
						resultType: GlobalSearchResultType.Train,
					});
				}
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
