import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { DisruptionBase, DisruptionsList, Station, StationsResponse } from "../models/ReisinformatieAPI";
import { map, mergeMap, tap } from "rxjs/operators";
import { TrainTracksGeoJSON } from "../models/SpoortkaartAPI";
import { DetailedTrainInformation, Train } from "../models/VirtualTrainAPI";
import { LngLatLike, Map as MapBoxMap, MapboxGeoJSONFeature } from "mapbox-gl";
import { GeoJSON } from "geojson";
import { Router } from "@angular/router";

@Injectable({
	providedIn: "root",
})
export class SharedDataService {
	stations?: StationsResponse;
	private _stations$ = new BehaviorSubject<StationsResponse>(null);
	get stations$(): Observable<StationsResponse> {
		return this._stations$.asObservable();
	}

	// Map popups
	selectedTrainOnMapFeature: MapboxGeoJSONFeature;
	selectedStationOnMapFeature: MapboxGeoJSONFeature;

	trainTracksLayerData?: TrainTracksGeoJSON;
	disruptedTrainTracksLayerData?: TrainTracksGeoJSON;
	activeDisruptions?: DisruptionsList;
	basicTrainInformation?: Train[];
	detailedTrainInformation?: DetailedTrainInformation[];
	private _detailedTrainInformation$ = new BehaviorSubject<DetailedTrainInformation[]>(null);
	get detailedTrainInformation$(): Observable<DetailedTrainInformation[]> {
		return this._detailedTrainInformation$.asObservable();
	}
	disruptionMarkersData: GeoJSON.Feature<GeoJSON.Point, DisruptionBase>[];

	trainMap?: MapBoxMap;

	constructor(private apiService: ApiService, private router: Router) {}

	get allDataLoaded(): boolean {
		return (
			this.stations != null &&
			this.trainTracksLayerData != null &&
			this.disruptedTrainTracksLayerData != null &&
			this.activeDisruptions != null
		);
	}

	getBasicInformationAboutAllStations(): Observable<StationsResponse> {
		return this.apiService.getBasicInformationAboutAllStations().pipe(
			tap((value) => {
				this.stations = value;
				this._stations$.next(value);
			})
		);
	}

	getTrainTracksGeoJSON(): Observable<TrainTracksGeoJSON> {
		return this.apiService.getTrainTracksGeoJSON().pipe(
			tap((value) => {
				this.trainTracksLayerData = value;
			})
		);
	}

	getDisruptedTrainTracksGeoJSON(): Observable<TrainTracksGeoJSON> {
		return this.apiService.getDisruptedTrainTracksGeoJSON().pipe(
			tap((value) => {
				this.disruptedTrainTracksLayerData = value;
			})
		);
	}

	getActiveDisruptions(): Observable<DisruptionsList> {
		return this.apiService.getActiveDisruptions().pipe(
			tap((value) => {
				this.activeDisruptions = value;
			})
		);
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
				this._detailedTrainInformation$.next(this.detailedTrainInformation);
				return this.detailedTrainInformation;
			})
		);
	}

	/**
	 * Fly to a station and open a station popup
	 * @param station The station
	 */
	flyToStation(station: Station): void {
		if (this.router.url !== "/kaart") {
			void this.router.navigateByUrl("/kaart");
		}
		if (this.trainMap && station) {
			this.closePopups();
			this.trainMap.flyTo({
				center: [station.lng, station.lat],
				zoom: 15,
			});
			this.trainMap.once("moveend", () => {
				const features = this.trainMap.queryRenderedFeatures(null, { layers: ["stations"] });
				if (features.length > 0) {
					const selectedFeature: MapboxGeoJSONFeature = features[0];
					selectedFeature.properties = station;
					this.selectedStationOnMapFeature = selectedFeature;
				}
			});
		}
	}

	flyToDisruption(disruption: DisruptionBase): void {
		if (this.router.url !== "/kaart") {
			void this.router.navigateByUrl("/kaart");
		}
		if (this.trainMap && disruption) {
			this.closePopups();
			const marker = this.disruptionMarkersData.find((m) => m.properties === disruption);
			if (marker) {
				this.trainMap.flyTo({
					center: marker.geometry.coordinates as LngLatLike,
					zoom: 11,
				});
			}
		}
	}

	flyToTrain(train: DetailedTrainInformation): void {
		if (this.router.url !== "/kaart") {
			void this.router.navigateByUrl("/kaart");
		}
		if (this.trainMap && train) {
			this.closePopups();
			this.trainMap.flyTo({
				center: [train.lng, train.lat],
				zoom: 15,
				speed: 1.0,
			});
			this.trainMap.once("moveend", () => {
				const features = this.trainMap.queryRenderedFeatures(null, { layers: ["trains"] });
				if (features.length > 0) {
					const selectedFeature: MapboxGeoJSONFeature = features.find(
						(f) => f.properties["ritId"] == train.ritId
					);
					if (selectedFeature) {
						selectedFeature.properties = train;
						this.selectedTrainOnMapFeature = selectedFeature;
					}
				}
			});
		}
	}

	private closePopups() {
		this.selectedTrainOnMapFeature = null;
		this.selectedStationOnMapFeature = null;
	}
}
