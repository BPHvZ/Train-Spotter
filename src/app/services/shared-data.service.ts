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

import { ElementRef, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { GeoJSON, MultiLineString } from "geojson";
import { LngLatLike, Map as MapBoxMap, MapboxGeoJSONFeature } from "mapbox-gl";
import { MarkerComponent } from "ngx-mapbox-gl/lib/marker/marker.component";
import { BehaviorSubject, combineLatest, fromEvent, Observable } from "rxjs";
import { debounceTime, map, switchMap, take, tap } from "rxjs/operators";
import { DisruptionBase, DisruptionsList, Station, StationsResponse } from "../models/ReisinformatieAPI";
import { TrainTracksGeoJSON } from "../models/SpoortkaartAPI";
import { TrainMapType } from "../models/TrainMapType";
import { DetailedTrainInformation } from "../models/VirtualTrainAPI";
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
	/**All train map types*/
	readonly mapTypes: TrainMapType[] = [
		{
			name: "Normaal",
			description: "Kaart met alleen treinen en stations",
			layerId: "ns-railroad",
		},
		{
			name: "Storingen",
			description: "Kaart met treinen, stations en actuele storingen",
			layerId: "storingen-railroad",
		},
	];
	//Active map
	/**Subscribable stations object*/
	private _activeMapType = new BehaviorSubject<TrainMapType>(this.mapTypes[0]);
	/**Observable of stations*/
	public readonly activeMapType$ = this._activeMapType.asObservable();

	// Map popups
	/**Train of selected popup*/
	selectedTrainOnMapFeature: MapboxGeoJSONFeature;
	/**Station of selected popup*/
	selectedStationOnMapFeature: MapboxGeoJSONFeature;

	/**Subscribable stations object*/
	private _stations = new BehaviorSubject<StationsResponse>(null);
	/**Observable of stations*/
	public readonly stations$ = this._stations.asObservable();

	/**Train tracks of disrupted tracks*/
	private readonly _disruptedTrainTracksLayerData: BehaviorSubject<TrainTracksGeoJSON> = new BehaviorSubject(null);
	/**Train tracks of disrupted tracks as observable*/
	public readonly disruptedTrainTracksLayerData$ = this._disruptedTrainTracksLayerData.asObservable();

	/**Markers for disruptions*/
	private readonly _disruptionMarkersData: BehaviorSubject<
		GeoJSON.Feature<GeoJSON.Point, DisruptionBase>[]
	> = new BehaviorSubject(null);
	/**Markers for disruptions as observables*/
	public readonly disruptionMarkersData$ = this._disruptionMarkersData.asObservable();

	/**Current disruptions*/
	private readonly _activeDisruptions: BehaviorSubject<DisruptionsList> = new BehaviorSubject(null);
	/**Current disruptions as observable*/
	public readonly activeDisruptions$ = this._activeDisruptions.asObservable();

	/**Subscribable disruptions object*/
	private _disruptionsLastUpdated = new BehaviorSubject<Date>(null);
	/**Observable of disruptions*/
	public readonly disruptionsLastUpdated$ = this._disruptionsLastUpdated.asObservable();

	/**Subscribable detailed train information object*/
	private _detailedTrainInformation = new BehaviorSubject<DetailedTrainInformation[]>(null);

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

	/**Subscribable window innerHeight object*/
	private _innerHeight = new BehaviorSubject<number>(window.innerHeight);
	/**Observable of window innerHeight*/
	public readonly innerHeight$ = this._innerHeight.asObservable();

	/*
	 * Data used by the header
	 * */
	/**Global search is ready when data has been loaded*/
	globalSearchReady$ = combineLatest([this._stations, this._detailedTrainInformation]);

	/*
	 * Data used to hover and focus on disruption markers on the map and cards in the sidebar
	 * */
	/**Disruption map markers*/
	disruptionMarkerElements = new Set<MarkerComponent>();
	/**Disruption sidebar cards*/
	disruptionCardElements = new Map<string, ElementRef>();
	/**Sidebar open/closed state*/
	private _sidebarState = new BehaviorSubject<"open" | "closed">("closed");
	/**Observable of sidebar open/closed state*/
	public readonly sidebarState$ = this._sidebarState.asObservable();

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
			this._disruptionsLastUpdated.next(dateData);
		}
		this.init();
	}

	/**
	 * Subscribe to browser window resize
	 */
	private init(): void {
		fromEvent(window, "resize")
			.pipe(debounceTime(1000))
			.subscribe(() => {
				// eslint-disable-next-line
				this.screenWidth = window.innerWidth;
				// eslint-disable-next-line
				this._innerHeight.next(window.innerHeight);
			});
	}

	/**
	 * Get minimal information about all trains
	 * @returns Observable<Response<TrainInformationResponse>> Minimal information about all trains
	 */
	getBasicInformationAboutAllStations(): Observable<StationsResponse> {
		return this.apiService.getBasicInformationAboutAllStations().pipe(
			take(1),
			map((response) => {
				this._stations.next(response.data);
				return response.data;
			})
		);
	}

	/**
	 * Get last stations response
	 * @return StationsResponse All stations
	 */
	stationsLastValue(): StationsResponse {
		let result: StationsResponse;
		this._stations.pipe(take(1)).subscribe((s) => (result = s));
		return result;
	}

	/**
	 * Get all train tracks
	 * @returns Observable<Response<TrainTracksGeoJSON>> All train tracks as GeoJSON
	 */
	getTrainTracksGeoJSON(): Observable<TrainTracksGeoJSON> {
		return this.apiService.getTrainTracksGeoJSON().pipe(
			take(1),
			map((response) => response.data)
		);
	}

	/**
	 * Get all disrupted train tracks
	 * @returns Observable<Response<TrainTracksGeoJSON>> All disrupted train tracks as GeoJSON
	 */
	updateDisruptedTrainTracksGeoJSON(force = false): Observable<void> {
		return this.apiService.getDisruptedTrainTracksGeoJSON(force).pipe(
			take(1),
			map((response) => {
				this._disruptedTrainTracksLayerData.next(response.data);
			})
		);
	}

	/**
	 * Get disrupted train track last response
	 * @return GeoJSON.FeatureCollection<MultiLineString> All disrupted train tracks
	 * */
	disruptedTrainTracksLayerDataLastValue(): GeoJSON.FeatureCollection<MultiLineString> {
		let result: TrainTracksGeoJSON;
		this._disruptedTrainTracksLayerData.pipe(take(1)).subscribe((s) => (result = s));
		return result?.payload as GeoJSON.FeatureCollection<MultiLineString>;
	}

	/**
	 * Update the data of disruption markers on the map
	 * @param markers Markers to be added to the map
	 */
	updateDisruptionMarkersData(markers: GeoJSON.Feature<GeoJSON.Point, DisruptionBase>[]): void {
		this.disruptionMarkerElements.clear();
		this._disruptionMarkersData.next(markers);
	}

	/**
	 * Get information about current disruptions
	 * @param force Force an update, do not check cache
	 * @returns Observable<Response<DisruptionsList>> Information about current disruptions
	 */
	updateActiveDisruptions(force = false): Observable<void> {
		return this.apiService.getActiveDisruptions(force).pipe(
			take(1),
			tap((response) => {
				if (response.responseType == ResponseType.URL) {
					const date = new Date();
					this._disruptionsLastUpdated.next(date);
					this.cacheService.save({
						key: "getActiveDisruptionsLastUpdated",
						data: JSON.stringify(date.toUTCString()),
					});
				}
			}),
			map((response) => {
				const all = response.data;

				const calamities = all.filter((a) => a.type == "CALAMITY");
				const disruptions = all.filter((a) => a.type == "DISRUPTION");
				const maintenance = all.filter((a) => a.type == "MAINTENANCE");

				calamities.sort((a, b) => ("" + a.type).localeCompare(b.type));

				calamities.sort((a, b) => ("" + a.type).localeCompare(b.type));
				disruptions.sort((a, b) => new Date(a["start"]).valueOf() - new Date(b["start"]).valueOf());
				maintenance.sort((a, b) => new Date(a["start"]).valueOf() - new Date(b["start"]).valueOf());

				const disruptionsSorted = calamities.concat(disruptions, maintenance);

				this._activeDisruptions.next(disruptionsSorted);
			})
		);
	}

	/**
	 * Get active disruptions last response
	 * @return DisruptionsList All active disruptions
	 */
	activeDisruptionsLastValue(): DisruptionsList {
		let result: DisruptionsList;
		this._activeDisruptions.pipe(take(1)).subscribe((s) => (result = s));
		return result;
	}

	/**
	 * Get detailed information about all trains by their ride id's
	 * @returns Observable<void> Detailed information about all trains
	 */
	updateDetailedInformationAboutActiveTrains(): Observable<void> {
		let trainInformation: DetailedTrainInformation[] = [];
		return this.apiService.getBasicInformationAboutAllTrains().pipe(
			take(1),
			map((response) => {
				const trains = response.data;
				trainInformation = trains.payload.treinen;
				let trainIds = "";
				trains.payload.treinen.forEach((train) => {
					trainIds += train.ritId + ",";
				});
				trainIds = trainIds.slice(0, -1);
				return trainIds;
			}),
			switchMap((trainIds) => {
				return this.apiService.getTrainDetailsByRideId(trainIds);
			}),
			map((response) => {
				const detailedTrainInformation = response.data;
				trainInformation.forEach((basicTrain) => {
					basicTrain.updatedAt = Date.now();
					basicTrain.trainDetails = detailedTrainInformation.find(
						(details) => details.ritnummer.toString() === basicTrain.ritId
					);
				});
				this._detailedTrainInformation.next(trainInformation);
			})
		);
	}

	/**
	 * Get train information last response
	 * @return DetailedTrainInformation[] Detailed information about all trains
	 */
	trainInformationLastValue(): DetailedTrainInformation[] {
		let result: DetailedTrainInformation[];
		this._detailedTrainInformation.pipe(take(1)).subscribe((s) => (result = s));
		return result;
	}

	/**
	 * Change the map {@link mapTypes}
	 * @param layer Map type to change to
	 */
	changeMapLayerType(layer: TrainMapType): void {
		this._activeMapType.next(layer);
		if (layer.layerId === "storingen-railroad") {
			this._sidebarState.next("open");
		}
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

		let disruptionMarkersData: GeoJSON.Feature<GeoJSON.Point, DisruptionBase>[];
		this._disruptionMarkersData.pipe(take(1)).subscribe((s) => (disruptionMarkersData = s));

		if (this.trainMap && disruption && disruptionMarkersData != null) {
			const markers = disruptionMarkersData;
			this.closePopups();
			this._activeMapType.next(this.mapTypes[1]);
			const marker = markers.find((m) => m.properties === disruption);
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
			this._activeMapType.next(this.mapTypes[0]);
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
	 * Find train information by ride id
	 * @param rideId Ride id of the train
	 * @return DetailedTrainInformation Train information or undefined
	 */
	findTrainByRideId(rideId: string): DetailedTrainInformation | undefined {
		return this.trainInformationLastValue().find((t) => t.ritId == rideId);
	}

	findStationByUICCode(UICCode: string): Station | undefined {
		return this.stationsLastValue().payload.find((s) => s.UICCode == UICCode);
	}

	findStationByCode(code: string): Station | undefined {
		return this.stationsLastValue().payload.find((s) => s.code == code);
	}

	/**
	 * Close all popups on the map
	 */
	closePopups(): void {
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

	/**
	 * Open or close the sidebar
	 */
	toggleSidebar(): void {
		let state: "open" | "closed";
		this._sidebarState.pipe(take(1)).subscribe((s) => (state = s));
		this._sidebarState.next(state === "closed" ? "open" : "closed");
	}
}
