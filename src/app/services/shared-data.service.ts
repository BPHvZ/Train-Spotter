import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, of } from "rxjs";
import { DisruptionsList, StationsResponse } from "../models/ReisinformatieAPI";
import { map, mergeMap } from "rxjs/operators";
import { TrainTracksGeoJSON } from "../models/SpoortkaartAPI";
import { DetailedTrainInformation, Train } from "../models/VirtualTrainAPI";

@Injectable({
	providedIn: "root",
})
export class SharedDataService {
	stations?: StationsResponse;
	get stations$(): Observable<StationsResponse> {
		return of(this.stations);
	}

	trainTracksLayerData?: TrainTracksGeoJSON;
	disruptedTrainTracksLayerData?: TrainTracksGeoJSON;
	activeDisruptions?: DisruptionsList;
	basicTrainInformation?: Train[];
	detailedTrainInformation?: DetailedTrainInformation[];

	constructor(private apiService: ApiService) {}

	get allDataLoaded(): boolean {
		return (
			this.stations != null &&
			this.trainTracksLayerData != null &&
			this.disruptedTrainTracksLayerData != null &&
			this.activeDisruptions != null
		);
	}

	getBasicInformationAboutAllStations(): Observable<StationsResponse> {
		return this.apiService.getBasicInformationAboutAllStations().pipe(map((value) => (this.stations = value)));
	}

	getTrainTracksGeoJSON(): Observable<TrainTracksGeoJSON> {
		return this.apiService.getTrainTracksGeoJSON().pipe(map((value) => (this.trainTracksLayerData = value)));
	}

	getDisruptedTrainTracksGeoJSON(): Observable<TrainTracksGeoJSON> {
		return this.apiService
			.getDisruptedTrainTracksGeoJSON()
			.pipe(map((value) => (this.disruptedTrainTracksLayerData = value)));
	}

	getActiveDisruptions(): Observable<DisruptionsList> {
		return this.apiService.getActiveDisruptions().pipe(map((value) => (this.activeDisruptions = value)));
	}

	getDetailedInformationAboutActiveTrains(): Observable<DetailedTrainInformation[]> {
		return this.apiService.getBasicInformationAboutAllTrains().pipe(
			mergeMap((trains) => {
				this.basicTrainInformation = trains.payload.treinen;
				this.detailedTrainInformation = trains.payload.treinen;
				let trainIds = "";
				trains.payload.treinen.forEach((train) => {
					trainIds += train.ritId + ",";
				});
				trainIds = trainIds.slice(0, -1);
				return this.apiService.getTrainDetailsByRideId(trainIds);
			}),
			map((trainDetails) => {
				this.detailedTrainInformation.forEach((basicTrain) => {
					basicTrain.trainDetails = trainDetails.find(
						(details) => details.ritnummer.toString() === basicTrain.ritId
					);
				});
				return this.detailedTrainInformation;
			})
		);
	}
}
