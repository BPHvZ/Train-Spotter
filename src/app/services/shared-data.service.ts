import { HostListener, Injectable, OnInit } from "@angular/core";
import { ApiService } from "./api.service";
import { BehaviorSubject, fromEvent, Observable } from "rxjs";
import { DisruptionBase, DisruptionsList, Station, StationsResponse } from "../models/ReisinformatieAPI";
import { debounceTime, map, mergeMap, takeUntil, tap } from "rxjs/operators";
import { TrainTracksGeoJSON } from "../models/SpoortkaartAPI";
import { DetailedTrainInformation, Train } from "../models/VirtualTrainAPI";
import { LngLatLike, Map as MapBoxMap, MapboxGeoJSONFeature } from "mapbox-gl";
import { GeoJSON } from "geojson";
import { Router } from "@angular/router";
import { CacheService } from "./cache.service";
import { ResponseType } from "./http-client.service";

@Injectable({
	providedIn: "root",
})
export class SharedDataService {
	/*
	 * Data used by the train map
	 * */
	stations?: StationsResponse;
	private _stations$ = new BehaviorSubject<StationsResponse>(null);
	get stations$(): Observable<StationsResponse> {
		return this._stations$.asObservable();
	}

	// Map popups
	selectedTrainOnMapFeature: MapboxGeoJSONFeature;
	selectedStationOnMapFeature: MapboxGeoJSONFeature;

	disruptedTrainTracksLayerData?: TrainTracksGeoJSON;
	disruptionMarkersData: GeoJSON.Feature<GeoJSON.Point, DisruptionBase>[];
	activeDisruptions?: DisruptionsList;
	private _getActiveDisruptionsLastUpdated$ = new BehaviorSubject<Date>(null);
	get getActiveDisruptionsLastUpdated$(): Observable<Date> {
		return this._getActiveDisruptionsLastUpdated$.asObservable();
	}

	trainTracksLayerData?: TrainTracksGeoJSON;
	basicTrainInformation?: Train[];
	detailedTrainInformation?: DetailedTrainInformation[];
	private _detailedTrainInformation$ = new BehaviorSubject<DetailedTrainInformation[]>(null);
	get detailedTrainInformation$(): Observable<DetailedTrainInformation[]> {
		return this._detailedTrainInformation$.asObservable();
	}

	trainMap?: MapBoxMap;

	/*
	 * Data used by the navbar
	 * */
	navbarCollapsed = true;
	private _navbarCollapsed$ = new BehaviorSubject<boolean>(true);
	get navbarCollapsed$(): Observable<boolean> {
		return this._navbarCollapsed$.asObservable();
	}
	screenWidth = window.innerWidth;

	constructor(private apiService: ApiService, private router: Router, private cacheService: CacheService) {
		const dateData = this.cacheService.load("getActiveDisruptionsLastUpdated") as Date;
		if (dateData) {
			this._getActiveDisruptionsLastUpdated$.next(dateData);
		}
		this.init();
	}

	init(): void {
		fromEvent(window, "resize")
			.pipe(debounceTime(1000))
			.subscribe((evt: any) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				this.screenWidth = evt.target.innerWidth;
				console.log(this.screenWidth);
			});
	}

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
			tap((response) => {
				this.stations = response.data;
				this._stations$.next(response.data);
				return response.data;
			}),
			map((response) => response.data)
		);
	}

	getTrainTracksGeoJSON(): Observable<TrainTracksGeoJSON> {
		return this.apiService.getTrainTracksGeoJSON().pipe(
			tap((response) => {
				this.trainTracksLayerData = response.data;
			}),
			map((response) => response.data)
		);
	}

	getDisruptedTrainTracksGeoJSON(force = false): Observable<TrainTracksGeoJSON> {
		return this.apiService.getDisruptedTrainTracksGeoJSON(force).pipe(
			tap((response) => {
				this.disruptedTrainTracksLayerData = response.data;
			}),
			map((response) => response.data)
		);
	}

	getActiveDisruptions(force = false): Observable<DisruptionsList> {
		return this.apiService.getActiveDisruptions(force).pipe(
			tap((response) => {
				if (response.responseType == ResponseType.URL) {
					const date = new Date();
					this._getActiveDisruptionsLastUpdated$.next(date);
					this.cacheService.save({
						key: "getActiveDisruptionsLastUpdated",
						data: JSON.stringify(date.toUTCString()),
					});
				}
				this.activeDisruptions = response.data;
			}),
			map((response) => response.data)
		);
	}

	getDetailedInformationAboutActiveTrains(): Observable<DetailedTrainInformation[]> {
		return this.apiService.getBasicInformationAboutAllTrains().pipe(
			mergeMap((response) => {
				const trains = response.data;
				this.basicTrainInformation = trains.payload.treinen;
				this.detailedTrainInformation = trains.payload.treinen;
				let trainIds = "";
				trains.payload.treinen.forEach((train) => {
					trainIds += train.ritId + ",";
				});
				trainIds = trainIds.slice(0, -1);
				return this.apiService.getTrainDetailsByRideId(trainIds);
			}),
			map((response) => {
				const trainDetails = response.data;
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

	toggleNavbar(): void {
		if (this.screenWidth <= 767) {
			this.navbarCollapsed = !this.navbarCollapsed;
		} else {
			this.navbarCollapsed = true;
		}
		this._navbarCollapsed$.next(this.navbarCollapsed);
	}
}
