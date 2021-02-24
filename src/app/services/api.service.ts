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

import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { DisruptionsList, StationsResponse } from "../models/ReisinformatieAPI";
import { TrainTracksGeoJSON } from "../models/SpoortkaartAPI";
import { TrainInformation, TrainInformationResponse } from "../models/VirtualTrainAPI";
import { HttpClientService, Response } from "./http-client.service";

@Injectable({
	providedIn: "root",
})
export class ApiService {
	constructor(private http: HttpClientService) {}

	getTrainTracksGeoJSON(): Observable<Response<TrainTracksGeoJSON>> {
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/Spoorkaart-API/api/v1/spoorkaart",
			cacheMins: environment.production ? 30 : 60,
			headers: {
				"Ocp-Apim-Subscription-Key": environment.NS_Ocp_Apim_Subscription_Key,
			},
		});
	}

	getDisruptedTrainTracksGeoJSON(force = false): Observable<Response<TrainTracksGeoJSON>> {
		const disruptionParams = new HttpParams().set("actual", "true");
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/Spoorkaart-API/api/v1/storingen",
			cacheMins: environment.production ? 1 : 60,
			headers: {
				"Ocp-Apim-Subscription-Key": environment.NS_Ocp_Apim_Subscription_Key,
			},
			params: disruptionParams,
			force: force,
		});
	}

	getBasicInformationAboutAllTrains(): Observable<Response<TrainInformationResponse>> {
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/virtual-train-api/api/vehicle",
			cacheMins: environment.production ? 0 : 60,
			headers: {
				"Ocp-Apim-Subscription-Key": environment.NS_Ocp_Apim_Subscription_Key,
			},
		});
	}

	getTrainDetailsByRideId(rideIds: string): Observable<Response<TrainInformation[]>> {
		const trainParams = new HttpParams().set("ids", rideIds).set("all", "false");
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/virtual-train-api/api/v1/trein",
			cacheMins: environment.production ? 0 : 60,
			headers: {
				"Ocp-Apim-Subscription-Key": environment.NS_Ocp_Apim_Subscription_Key,
			},
			params: trainParams,
		});
	}

	getActiveDisruptions(force = false): Observable<Response<DisruptionsList>> {
		const disruptionParams = new HttpParams().set("isActive", "true");
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3/disruptions",
			cacheMins: environment.production ? 1 : 60,
			headers: {
				"Ocp-Apim-Subscription-Key": environment.NS_Ocp_Apim_Subscription_Key,
			},
			params: disruptionParams,
			force: force,
		});
	}

	getBasicInformationAboutAllStations(): Observable<Response<StationsResponse>> {
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations",
			cacheMins: 60,
			headers: {
				"Ocp-Apim-Subscription-Key": environment.NS_Ocp_Apim_Subscription_Key,
			},
		});
	}
}
