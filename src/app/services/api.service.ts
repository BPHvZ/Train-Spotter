import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { HttpClientService } from "./http-client.service";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";
import { DisruptionsList, Station, StationsResponse } from "../models/ReisinformatieAPI";
import { TrainTracksGeoJSON } from "../models/SpoortkaartAPI";
import { TrainInformation, TrainInformationResponse } from "../models/VirtualTrainAPI";
import { SharedDataService } from "./shared-data.service";

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

	getDisruptedTrainTracksGeoJSON(): Observable<TrainTracksGeoJSON> {
		const disruptionParams = new HttpParams().set("actual", "true");
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/Spoorkaart-API/api/v1/storingen",
			cacheMins: environment.production ? 1 : 60,
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

	getActiveDisruptions(): Observable<DisruptionsList> {
		const disruptionParams = new HttpParams().set("isActive", "true");
		return this.http.get({
			url: "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3/disruptions",
			cacheMins: environment.production ? 1 : 60,
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
