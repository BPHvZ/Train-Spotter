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
import { Observable, of, zip } from "rxjs";
import { map } from "rxjs/operators";
import { GlobalSearchResult, GlobalSearchResultType } from "../models/GlobalSearch";
import { StationsResponse } from "../models/ReisinformatieAPI";
import { DetailedTrainInformation } from "../models/VirtualTrainAPI";
import { HelperFunctionsService } from "./helper-functions.service";
import { SharedDataService } from "./shared-data.service";

/**
 * Full text search for station and trains
 * */
@Injectable({
	providedIn: "root",
})
export class GlobalSearchService {
	/**All Stations*/
	private _stations: StationsResponse = null;
	/**All current trains*/
	private _trains: DetailedTrainInformation[] = null;

	/**
	 * Define services.
	 * Subscribe to receive the latest stations and trains
	 * @param sharedDataService Shares data through the application
	 * @param helperFunctionsService Helper functions
	 */
	constructor(private sharedDataService: SharedDataService, private helperFunctionsService: HelperFunctionsService) {
		this.sharedDataService.detailedTrainInformation$.subscribe((value) => {
			this._trains = value;
		});
		this.sharedDataService.stations$.subscribe((value) => {
			this._stations = value;
		});
	}

	/**
	 * Do a global search on station and trains
	 * @param term Text to search for
	 * @returns Observable<GlobalSearchResult[]> List of search results
	 */
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

	/**
	 * Search stations and trains
	 * Search stations by:
	 * - Name
	 * - Code
	 * Search trains by:
	 * - Ride id
	 * - Trainpart
	 * - Train type
	 * @param term Text to search for
	 * @returns All search results
	 */
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
}
