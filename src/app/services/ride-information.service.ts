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
import { Observable, of } from "rxjs";
import { catchError, map, switchMap, take } from "rxjs/operators";
import { DetailedTrainInformation } from "../models/VirtualTrainAPI";
import { ApiService } from "./api.service";
import { SharedDataService } from "./shared-data.service";

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

	/**
	 * Get detailed information about a certain train
	 * @returns Observable<void> Detailed information about all trains
	 */
	getDetailedInformationAboutOneTrain(rideId: number): Observable<DetailedTrainInformation> {
		let trainInformation: DetailedTrainInformation;
		return this.apiService.getBasicInformationAboutAllTrains().pipe(
			take(1),
			map((response) => {
				const trains = response.data;
				const allTrains = trains.payload.treinen;
				trainInformation = allTrains.find((t) => t.ritId == rideId.toString());
				if (trainInformation == null) {
					throw Error(`Traininformation for train ${rideId} not found`);
				}
			}),
			switchMap(() => {
				return this.apiService.getTrainDetailsByRideId(rideId.toString());
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

	getRideInformation(rideId: number): Observable<DetailedTrainInformation> {
		const allTrainInformation = this.sharedDataService.trainInformationLastValue();
		if (allTrainInformation != null && allTrainInformation.length > 0) {
			console.log("finding in shared data");
			const train = allTrainInformation.find((train) => train.ritId == rideId.toString());
			if (train != null) {
				return of(train);
			}
		}
		return this.getDetailedInformationAboutOneTrain(rideId);
	}
}
