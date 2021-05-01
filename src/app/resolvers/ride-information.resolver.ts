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
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable, zip } from "rxjs";
import { map } from "rxjs/operators";
import { RideInformation } from "../models/RideInformation";
import { RideInformationService } from "../services/ride-information.service";
import { SharedDataService } from "../services/shared-data.service";

/** Resolve loading train information before showing train information page */
@Injectable({
	providedIn: "root",
})
export class RideInformationResolver implements Resolve<RideInformation> {
	/**
	 * Define services
	 * @param rideInformationService Get ride information about a train
	 * @param sharedDataService Shares data through the application
	 */
	constructor(private rideInformationService: RideInformationService, private sharedDataService: SharedDataService) {}

	/**
	 * Get ride information by the ride id
	 * @param route Current route snapshot
	 * @return Observable<RideInformation> Train information
	 */
	resolve(route: ActivatedRouteSnapshot): Observable<RideInformation> {
		console.log("resolve ", route.paramMap.get("rideId"));
		return zip(
			this.rideInformationService.getRideInformationByRideId(route.params["rideId"]),
			this.sharedDataService.getBasicInformationAboutAllStations(),
			this.rideInformationService.getJourneyDetails(route.params["rideId"])
		).pipe(
			map(([train, _, journey]) => {
				return {
					trainInformation: train,
					journey: journey,
				};
			})
		);
	}
}
