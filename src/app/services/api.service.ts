import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpClientService } from "./http-client.service";
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

	getTrainTracksGeoJSON(): Observable<TrainTracksGeoJSON> {
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/Spoorkaart-API/api/v1/spoorkaart",
			cacheMins: environment.production ? 30 : 60,
			headers: {
				"Ocp-Apim-Subscription-Key": environment.NS_Ocp_Apim_Subscription_Key,
			},
		});
	}

	getDisruptedTrainTracksGeoJSON(force = false): Observable<TrainTracksGeoJSON> {
		const disruptionParams = new HttpParams().set("actual", "true");
		let cacheMins = environment.production ? 1 : 60;
		if (force) cacheMins = 0;
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/Spoorkaart-API/api/v1/storingen",
			cacheMins: cacheMins,
			headers: {
				"Ocp-Apim-Subscription-Key": environment.NS_Ocp_Apim_Subscription_Key,
			},
			params: disruptionParams,
		});
	}

	getBasicInformationAboutAllTrains(): Observable<TrainInformationResponse> {
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/virtual-train-api/api/vehicle",
			cacheMins: environment.production ? 0 : 60,
			headers: {
				"Ocp-Apim-Subscription-Key": environment.NS_Ocp_Apim_Subscription_Key,
			},
		});
	}

	getTrainDetailsByRideId(rideIds: string): Observable<TrainInformation[]> {
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

	getActiveDisruptions(force = false): Observable<DisruptionsList> {
		const disruptionParams = new HttpParams().set("isActive", "true");
		let cacheMins = environment.production ? 1 : 60;
		if (force) cacheMins = 0;
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3/disruptions",
			cacheMins: cacheMins,
			headers: {
				"Ocp-Apim-Subscription-Key": environment.NS_Ocp_Apim_Subscription_Key,
			},
			params: disruptionParams,
		});
	}

	getBasicInformationAboutAllStations(): Observable<StationsResponse> {
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations",
			cacheMins: 60,
			headers: {
				"Ocp-Apim-Subscription-Key": environment.NS_Ocp_Apim_Subscription_Key,
			},
		});
	}
}
