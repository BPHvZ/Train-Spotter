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
import { Router } from "@angular/router";
import { Observable, of, zip } from "rxjs";
import { catchError, concatMap, map, switchMap, take, tap } from "rxjs/operators";
import { Journey } from "../models/ReisinformatieAPI";
import { RideInformation } from "../models/RideInformation";
import { TrainTracksGeoJSON } from "../models/SpoortkaartAPI";
import { DetailedTrainInformation } from "../models/VirtualTrainAPI";
import { ApiService } from "./api.service";
import { SharedDataService } from "./shared-data.service";

/** Used by resolver, get train information from shared data or fetch from API */
@Injectable({
	providedIn: "root",
})
export class RideInformationService {
	/**
	 * Define services
	 * @param sharedDataService Shares data through the application
	 * @param apiService Requests for NS API
	 * @param router Router object
	 */
	constructor(private sharedDataService: SharedDataService, private apiService: ApiService, private router: Router) {}

	getRideInformation(rideId: string): Observable<RideInformation> {
		let journey: Journey;
		return zip(
			this.getRideInformationByRideId(rideId),
			this.sharedDataService.getBasicInformationAboutAllStations(),
			this.getJourneyDetails(rideId).pipe(
				tap((resp) => (journey = resp)),
				switchMap((details) => {
					const stationCodes: string[] = [];
					details.stops.forEach((stop) => {
						if (stop.id) {
							const code = stop.id.split("_")[0];
							stationCodes.push(code);
						}
					});
					return this.getRouteGeoJSON(stationCodes);
				})
			)
		).pipe(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			map(([train, _, routeTracks]) => {
				return {
					trainInformation: train,
					journey: journey,
					routeGeoJSON: routeTracks,
				};
			})
		);
	}

	/**
	 * Get detailed information about a certain train
	 * @returns Observable<void> Detailed information about all trains
	 */
	getDetailedInformationAboutOneTrain(rideId: string): Observable<DetailedTrainInformation> {
		let trainInformation: DetailedTrainInformation;
		return this.apiService.getBasicInformationAboutAllTrains().pipe(
			take(1),
			map((response) => {
				const trains = response.data;
				const allTrains = trains.payload.treinen;
				trainInformation = allTrains.find((t) => t.ritId == rideId);
				if (trainInformation == null) {
					throw Error(`Traininformation for train ${rideId} not found`);
				}
			}),
			switchMap(() => {
				return this.apiService.getTrainDetailsByRideId(rideId);
			}),
			map((response) => {
				const detailedTrainInformation = response.data;
				trainInformation.trainDetails = detailedTrainInformation.find(
					(details) => details.ritnummer.toString() === trainInformation.ritId
				);
				return trainInformation;
			}),
			catchError(() => void this.router.navigateByUrl("/404"))
		);
	}

	/**
	 * Get train information by ride id, used by the resolver.
	 * Will check shared data and otherwise get data from the API
	 * @param rideId Ride id of the train
	 * @return Observable<DetailedTrainInformation> Train information
	 */
	getRideInformationByRideId(rideId: string): Observable<DetailedTrainInformation> {
		const allTrainInformation = this.sharedDataService.trainInformationLastValue();
		if (allTrainInformation != null && allTrainInformation.length > 0) {
			console.log("finding in shared data");
			const train = allTrainInformation.find((train) => train.ritId == rideId);
			if (train != null) {
				return of(train);
			}
		}
		return this.getDetailedInformationAboutOneTrain(rideId);
	}

	/**
	 * Get train information by trainset number, used by the resolver.
	 * Trainset number will be converted to the ride id of the train that its part of.
	 * Will check shared data and otherwise get data from the API
	 * @param trainsetNr Number of the trainset
	 * @param rideId Ride id of the train of which the trainset is a part of.
	 * @return Observable<DetailedTrainInformation> Train information
	 */
	getRideInformationByTrainsetNr(trainsetNr: number, rideId?: string): Observable<DetailedTrainInformation> {
		const allTrainInformation = this.sharedDataService.trainInformationLastValue();
		if (allTrainInformation != null && allTrainInformation.length > 0 && rideId) {
			console.log("finding in shared data");
			const train = allTrainInformation.find((train) => train.ritId == rideId);
			if (train != null) {
				return of(train);
			}
		}
		return this.apiService.convertTrainsetNrToRideId(trainsetNr.toString()).pipe(
			concatMap((response) => {
				console.log(response.data);
				return this.getDetailedInformationAboutOneTrain(response.data.toString());
			}),
			catchError(() => void this.router.navigateByUrl("/404"))
		);
	}

	getJourneyDetails(rideId: string): Observable<Journey> {
		return this.apiService.getJourneyDetails(rideId).pipe(map((response) => response.data.payload));
	}

	getRouteGeoJSON(stations: string[]): Observable<TrainTracksGeoJSON> {
		return this.apiService.getRouteGeoJSON(stations).pipe(map((response) => response.data));
	}
}
