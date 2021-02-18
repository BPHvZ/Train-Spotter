import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpClientService, Response } from "./http-client.service";
import { environment } from "../../environments/environment";
import { DisruptionsList, StationsResponse } from "../models/ReisinformatieAPI";
import { TrainTracksGeoJSON } from "../models/SpoortkaartAPI";
import { TrainInformation, TrainInformationResponse } from "../models/VirtualTrainAPI";
import { CacheService } from "./cache.service";

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
