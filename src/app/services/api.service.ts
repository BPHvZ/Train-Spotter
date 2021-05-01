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
import {
	DisruptionsList,
	JourneyResponse,
	StationArrivalsResponse,
	StationDeparturesResponse,
	StationsResponse,
} from "../models/ReisinformatieAPI";
import { TrainTracksGeoJSON } from "../models/SpoortkaartAPI";
import { TrainInformation, TrainInformationResponse } from "../models/VirtualTrainAPI";
import { HttpClientService, Response } from "./http-client.service";

/**
 * Network request for the NS API
 */
@Injectable({
	providedIn: "root",
})
export class ApiService {
	// Section: Spoorkaart-API
	/**
	 * Define services
	 * @param http Http service with caching
	 */
	constructor(private http: HttpClientService) {}

	/**
	 * Get all train tracks
	 * [Spoorkaart-API/api/v1/spoorkaart]{@link https://apiportal.ns.nl/docs/services/Spoorkaart-api/operations/getSpoorkaart}
	 * @returns Observable<Response<TrainTracksGeoJSON>> All train tracks as GeoJSON
	 */
	getTrainTracksGeoJSON(): Observable<Response<TrainTracksGeoJSON>> {
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/Spoorkaart-API/api/v1/spoorkaart",
			cacheMins: environment.production ? 30 : 60,
		});
	}

	/**
	 * Get all disrupted train tracks
	 * [Spoorkaart-API/api/v1/storingen]{@link https://apiportal.ns.nl/docs/services/Spoorkaart-api/operations/getStoringen}
	 * @returns Observable<Response<TrainTracksGeoJSON>> All disrupted train tracks as GeoJSON
	 */
	getDisruptedTrainTracksGeoJSON(force = false): Observable<Response<TrainTracksGeoJSON>> {
		const disruptionParams = new HttpParams().set("actual", "true");
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/Spoorkaart-API/api/v1/storingen",
			cacheMins: environment.production ? 1 : 60,
			params: disruptionParams,
			force: force,
		});
	}

	// Section: virtual-train-api
	/**
	 * Get minimal information about all trains
	 * [virtual-train-api/api/vehicle]{@link https://apiportal.ns.nl/docs/services/virtual-train-api/operations/getVehicles?}
	 * @returns Observable<Response<TrainInformationResponse>> Minimal information about all trains
	 */
	getBasicInformationAboutAllTrains(): Observable<Response<TrainInformationResponse>> {
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/virtual-train-api/api/vehicle",
			cacheMins: environment.production ? 0 : 60,
		});
	}

	/**
	 * Get detailed information about all trains by their ride id's
	 * [virtual-train-api/api/v1/trein]{@link https://apiportal.ns.nl/docs/services/virtual-train-api/operations/getTreinInformatie_2?}
	 * @param rideIds Comma separated string of all ride id's
	 * @returns Observable<Response<TrainInformation[]>> Detailed information about all trains
	 */
	getTrainDetailsByRideId(rideIds: string): Observable<Response<TrainInformation[]>> {
		const trainParams = new HttpParams().set("ids", rideIds).set("all", "false");
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/virtual-train-api/api/v1/trein",
			cacheMins: environment.production ? 0 : 60,
			params: trainParams,
		});
	}

	/**
	 * Convert a trainset number to the rideId it's part of
	 * [virtual-train-api/api/v1/trein]{@link https://apiportal.ns.nl/docs/services/virtual-train-api/operations/getTreinInformatie?}
	 * @param trainsetNr Number of the trainset
	 * @returns Observable<Response<number>> RideId of which the
	 */
	convertTrainsetNrToRideId(trainsetNr: string): Observable<Response<number>> {
		return this.http.get({
			url: `https://gateway.apiportal.ns.nl/virtual-train-api/api/v1/ritnummer/${trainsetNr}`,
			cacheMins: environment.production ? 1 : 1,
		});
	}

	// Section: reisinformatie-api
	/**
	 * Get information about current disruptions
	 * [reisinformatie-api/api/v3/disruptions]{@link https://apiportal.ns.nl/docs/services/reisinformatie-api/operations/getDisruptions_v3?}
	 * @param force Force an update, do not check cache
	 * @returns Observable<Response<DisruptionsList>> Information about current disruptions
	 */
	getActiveDisruptions(force = false): Observable<Response<DisruptionsList>> {
		const disruptionParams = new HttpParams().set("isActive", "true");
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3/disruptions",
			cacheMins: environment.production ? 1 : 60,
			params: disruptionParams,
			force: force,
		});
	}

	/**
	 * Get information about all stations
	 * [reisinformatie-api/api/v2/stations]{@link https://apiportal.ns.nl/docs/services/reisinformatie-api/operations/getStations?}
	 * @returns Observable<Response<StationsResponse>> Information about all stations
	 */
	getBasicInformationAboutAllStations(): Observable<Response<StationsResponse>> {
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations",
			cacheMins: 60,
		});
	}

	/**
	 * Get information about a stations current arrivals
	 * [reisinformatie-api/api/v2/getArrivals]{@link https://apiportal.ns.nl/docs/services/reisinformatie-api/operations/getArrivals?}
	 * @param uicCode UIC code of the Stations
	 * @param maxJourneys Number of arrivals to retrieve
	 * @returns Observable<Response<StationArrivalsResponse>> Stations current arrivals
	 */
	getStationArrivals(uicCode: string, maxJourneys = 40): Observable<Response<StationArrivalsResponse>> {
		const stationParams = new HttpParams().set("uicCode", uicCode).set("maxJourneys", maxJourneys.toString());
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/arrivals",
			cacheMins: environment.production ? 1 : 60,
			params: stationParams,
		});
	}

	/**
	 * Get information about a stations current departures
	 * [reisinformatie-api/api/v2/departures]{@link https://apiportal.ns.nl/docs/services/reisinformatie-api/operations/getDepartures?}
	 * @param uicCode UIC code of the Stations
	 * @param maxJourneys Number of departures to retrieve
	 * @returns Observable<Response<StationArrivalsResponse>> Stations current departures
	 */
	getStationDepartures(uicCode: string, maxJourneys = 40): Observable<Response<StationDeparturesResponse>> {
		const stationParams = new HttpParams().set("uicCode", uicCode).set("maxJourneys", maxJourneys.toString());
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures",
			cacheMins: environment.production ? 1 : 60,
			params: stationParams,
		});
	}

	/**
	 * Get information about a trains journey
	 * [reisinformatie-api/api/v2/journey]{@link https://apiportal.ns.nl/docs/services/reisinformatie-api/operations/getJourneyDetail?}
	 * @param rideId Ride id of the train
	 * @returns Observable<Response<JourneyResponse>> Journey of a train
	 */
	getJourneyDetails(rideId: string): Observable<Response<JourneyResponse>> {
		const journeyParams = new HttpParams().set("train", rideId);
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/journey",
			cacheMins: environment.production ? 1 : 60,
			params: journeyParams,
		});
	}
}
