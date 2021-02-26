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
import { Router } from "@angular/router";
import { GeoJSON } from "geojson";
import { LngLatLike, Map as MapBoxMap, MapboxGeoJSONFeature } from "mapbox-gl";
import { BehaviorSubject, fromEvent, Observable } from "rxjs";
import { debounceTime, map, mergeMap, tap } from "rxjs/operators";
import { DisruptionBase, DisruptionsList, Station, StationsResponse } from "../models/ReisinformatieAPI";
import { TrainTracksGeoJSON } from "../models/SpoortkaartAPI";
import { DetailedTrainInformation, Train } from "../models/VirtualTrainAPI";
import { ApiService } from "./api.service";
import { CacheService } from "./cache.service";
import { ResponseType } from "./http-client.service";

/**
 * Hub for all shared data in the application
 */
@Injectable({
	providedIn: "root",
})
export class SharedDataService {
	/*
	 * Data used by the train map
	 * */
	/**All stations*/
	stations?: StationsResponse;
	/**Subscribable stations object*/
	private _stations$ = new BehaviorSubject<StationsResponse>(null);
	/**Observable of stations*/
	get stations$(): Observable<StationsResponse> {
		return this._stations$.asObservable();
	}

	// Map popups
	/**Train of selected popup*/
	selectedTrainOnMapFeature: MapboxGeoJSONFeature;
	/**Station of selected popup*/
	selectedStationOnMapFeature: MapboxGeoJSONFeature;

	/**Train tracks of disrupted tracks*/
	disruptedTrainTracksLayerData?: TrainTracksGeoJSON;
	/**Markers for disruptions*/
	disruptionMarkersData: GeoJSON.Feature<GeoJSON.Point, DisruptionBase>[];
	/**Current disruptions*/
	activeDisruptions?: DisruptionsList;
	/**Subscribable disruptions object*/
	private _getActiveDisruptionsLastUpdated$ = new BehaviorSubject<Date>(null);
	/**Observable of disruptions*/
	get getActiveDisruptionsLastUpdated$(): Observable<Date> {
		return this._getActiveDisruptionsLastUpdated$.asObservable();
	}

	/**Trains on map*/
	trainTracksLayerData?: TrainTracksGeoJSON;
	/**Minimal train information*/
	basicTrainInformation?: Train[];
	/**Detailed train information*/
	detailedTrainInformation?: DetailedTrainInformation[];
	/**Subscribable detailed train information object*/
	private _detailedTrainInformation$ = new BehaviorSubject<DetailedTrainInformation[]>(null);
	/**Observable of detailed train information*/
	get detailedTrainInformation$(): Observable<DetailedTrainInformation[]> {
		return this._detailedTrainInformation$.asObservable();
	}

	/**Mapbox map*/
	trainMap?: MapBoxMap;

	/*
	 * Data used by the navbar
	 * */
	/**Navbar collapse status*/
	navbarCollapsed = true;
	/**Subscribable navbar collapse status object*/
	private _navbarCollapsed$ = new BehaviorSubject<boolean>(true);
	/**Observable of navbar collapse status*/
	get navbarCollapsed$(): Observable<boolean> {
		return this._navbarCollapsed$.asObservable();
	}
	/**Current browser screen width*/
	screenWidth = window.innerWidth;

	/**
	 * Defines services
	 * Get last updated date for disruptions in sidebar
	 * @param apiService Requests for NS API
	 * @param router Router object
	 * @param cacheService Load and save data in cache
	 */
	constructor(private apiService: ApiService, private router: Router, private cacheService: CacheService) {
		const dateData = this.cacheService.load("getActiveDisruptionsLastUpdated") as Date;
		if (dateData) {
			this._getActiveDisruptionsLastUpdated$.next(dateData);
		}
		this.init();
	}

	/**
	 * Subscribe to browser window resize
	 */
	private init(): void {
		fromEvent(window, "resize")
			.pipe(debounceTime(1000))
			.subscribe((evt: any) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				this.screenWidth = evt.target.innerWidth;
				console.log(this.screenWidth);
			});
	}

	/**
	 * Return True when all initial data is loaded
	 */
	get allDataLoaded(): boolean {
		return (
			this.stations != null &&
			this.trainTracksLayerData != null &&
			this.disruptedTrainTracksLayerData != null &&
			this.activeDisruptions != null
		);
	}

	/**
	 * Get minimal information about all trains
	 * @returns Observable<Response<TrainInformationResponse>> Minimal information about all trains
	 */
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

	/**
	 * Get all train tracks
	 * @returns Observable<Response<TrainTracksGeoJSON>> All train tracks as GeoJSON
	 */
	getTrainTracksGeoJSON(): Observable<TrainTracksGeoJSON> {
		return this.apiService.getTrainTracksGeoJSON().pipe(
			tap((response) => {
				this.trainTracksLayerData = response.data;
			}),
			map((response) => response.data)
		);
	}

	/**
	 * Get all disrupted train tracks
	 * @returns Observable<Response<TrainTracksGeoJSON>> All disrupted train tracks as GeoJSON
	 */
	getDisruptedTrainTracksGeoJSON(force = false): Observable<TrainTracksGeoJSON> {
		return this.apiService.getDisruptedTrainTracksGeoJSON(force).pipe(
			tap((response) => {
				this.disruptedTrainTracksLayerData = response.data;
			}),
			map((response) => response.data)
		);
	}

	/**
	 * Get information about current disruptions
	 * @param force Force an update, do not check cache
	 * @returns Observable<Response<DisruptionsList>> Information about current disruptions
	 */
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

	/**
	 * Get detailed information about all trains by their ride id's
	 * @returns Observable<Response<TrainInformation[]>> Detailed information about all trains
	 */
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
	 * @param station The station to fly to
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

	/**
	 * Fly to a disruption area
	 * @param disruption The disruption to fly to
	 */
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

	/**
	 * Fly to a train and open a train popup
	 * @param train The train to fly to
	 */
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

	/**
	 * Close all popups on the map
	 */
	private closePopups() {
		this.selectedTrainOnMapFeature = null;
		this.selectedStationOnMapFeature = null;
	}

	/**
	 * Open/close navbar on smaller screens
	 */
	toggleNavbar(): void {
		if (this.screenWidth <= 767) {
			this.navbarCollapsed = !this.navbarCollapsed;
		} else {
			this.navbarCollapsed = true;
		}
		this._navbarCollapsed$.next(this.navbarCollapsed);
	}
}
