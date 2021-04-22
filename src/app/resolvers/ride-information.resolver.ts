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
import { Observable } from "rxjs";
import { DetailedTrainInformation } from "../models/VirtualTrainAPI";
import { RideInformationService } from "../services/ride-information.service";

@Injectable({
	providedIn: "root",
})
export class RideInformationResolver implements Resolve<DetailedTrainInformation> {
	/**
	 * Define services
	 * @param rideInformationService Get ride information about a train
	 */
	constructor(private rideInformationService: RideInformationService) {}

	resolve(route: ActivatedRouteSnapshot): Observable<DetailedTrainInformation> {
		console.log("resolve ", route.paramMap.get("rideId"));
		return this.rideInformationService.getRideInformationByRideId(route.params["rideId"]);
	}
}
