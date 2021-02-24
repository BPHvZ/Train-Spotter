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

import { Component, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { GeoJSON, MultiLineString } from "geojson";
import {
	EventData,
	Map as MapBoxMap,
	MapboxEvent,
	MapboxGeoJSONFeature,
	MapLayerMouseEvent,
	MapMouseEvent,
	MapSourceDataEvent,
	SymbolLayout,
} from "mapbox-gl";
import { interval, PartialObserver, Subject, zip } from "rxjs";
import { pausable, PausableObservable } from "rxjs-pausable";
import { environment } from "../../../environments/environment";
import { DisruptionBase, DisruptionsList, Station, StationsResponse } from "../../models/ReisinformatieAPI";
import { SpoortkaartFeatureCollection, TrainTracksGeoJSON } from "../../models/SpoortkaartAPI";
import { TrainMapType } from "../../models/TrainMapType";
import { DetailedTrainInformation, TrainIconOnMap } from "../../models/VirtualTrainAPI";
import { HelperFunctionsService } from "../../services/helper-functions.service";
import { ImageEditorService } from "../../services/image-editor.service";
import { SharedDataService } from "../../services/shared-data.service";
import { TrainMapSidebarComponent } from "../train-map-sidebar/train-map-sidebar.component";

/**
 * Train map with stations and trains that get update every x seconds
 */
@Component({
	selector: "app-train-map",
	templateUrl: "./train-map.component.html",
	styleUrls: ["./train-map.component.sass"],
})
export class TrainMapComponent implements OnInit {
	@ViewChild(TrainMapSidebarComponent) sidebar: TrainMapSidebarComponent;

	// MapBox setup
	mapStyle = environment.MAPBOX_STYLE;
	lng = 5.476;
	lat = 52.1284;
	zoom = 6.73;

	// Map popups
	get selectedTrainOnMapFeature(): MapboxGeoJSONFeature {
		return this.sharedDataService.selectedTrainOnMapFeature;
	}
	get selectedStationOnMapFeature(): MapboxGeoJSONFeature {
		return this.sharedDataService.selectedStationOnMapFeature;
	}

	// Update data countdown
	private progressNum = 100;
	updateTrainsIsPaused = false;
	isUpdatingMapData = false;
	updateTrainsTimer: PausableObservable<number>;
	timerObserver: PartialObserver<number>;

	// Map styles
	mapTypes: TrainMapType[] = [
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
	activeMapType: TrainMapType = this.mapTypes[0];

	// Station layer
	stationsLayerLayout: SymbolLayout = {
		"icon-image": "NS",
		"icon-size": 0.15,
		"icon-allow-overlap": true,
	};
	stationsLayerData: GeoJSON.FeatureCollection<GeoJSON.Geometry>;

	// Train tracks layer
	trainTracksLayerData: SpoortkaartFeatureCollection;

	// Disruptions layer
	get activeDisruptions(): DisruptionsList {
		return this.sharedDataService.activeDisruptions;
	}
	get disruptedTrainTracksLayerData(): GeoJSON.FeatureCollection<MultiLineString> {
		return this.sharedDataService.disruptedTrainTracksLayerData
			?.payload as GeoJSON.FeatureCollection<MultiLineString>;
	}
	get disruptionMarkersData(): GeoJSON.Feature<GeoJSON.Point, DisruptionBase>[] {
		return this.sharedDataService.disruptionMarkersData;
	}

	// Trains layer
	trainsLayerData: GeoJSON.FeatureCollection<GeoJSON.Geometry>;

	// Train icons
	private trainIconAddedSource = new Subject<string>();
	trainIconAdded = this.trainIconAddedSource.asObservable();
	private trainIconNames: Set<string> = new Set<string>();
	private trainIconsAdded: Set<string> = new Set<string>();
	trainIconsForMap: TrainIconOnMap[] = [];

	constructor(
		private sharedDataService: SharedDataService,
		private helperFunctions: HelperFunctionsService,
		private router: Router,
		private imageEditorService: ImageEditorService
	) {}

	/**
	 * Set {@link updateTrainsTimer} and {@link progressNum}
	 * Fly to station when this component is reused and navigated to from another component with extra state parameters
	 */
	ngOnInit(): void {
		this.updateTrainsTimer = interval(10).pipe(pausable()) as PausableObservable<number>;
		this.pauseOrResumeUpdatingTrainPositions(true);

		this.timerObserver = {
			next: (count: number) => {
				const timePassedInMs = 10 * count;
				const timePassedInSec = timePassedInMs / 100;
				const timeLeftInSec = 100 - timePassedInSec;
				if (timeLeftInSec > 0.0) {
					this.progressNum = timeLeftInSec;
				} else if (timeLeftInSec < 0.0) {
					this.progressNum = 100;
					if (this.isUpdatingMapData === false) {
						this.updateTrainsAndDisruptions();
					}
				}
			},
		};
		this.updateTrainsTimer.subscribe(this.timerObserver);

		this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				console.log(event.url);
			}
			if (event instanceof NavigationEnd && event.url === "/kaart") {
				const navigationState = this.router.getCurrentNavigation().extras.state;
				if (navigationState) {
					if (navigationState.station) {
						this.sharedDataService.flyToStation(navigationState.station);
					}
				}
			}
		});
	}

	/**
	 * get the progress used by the progress indicator
	 */
	get getProgress(): string {
		return `${this.progressNum}%`;
	}

	/**
	 * Receive an event when a train icon has been loaded
	 * @param trainIconName The train icon name
	 */
	onIconLoad(trainIconName: string): void {
		this.trainIconAddedSource.next(trainIconName);
	}

	/**
	 * pause or resume the {@link updateTrainsTimer}
	 * @param pause Whether to pause the train updater or not
	 */
	pauseOrResumeUpdatingTrainPositions(pause: boolean): void {
		// console.log(`isUpdatingMapData: ${this.isUpdatingMapData} updateTrainsIsPaused: ${this.updateTrainsIsPaused} pause: ${pause}`);
		if (this.isUpdatingMapData === false) {
			if (pause === false) {
				this.updateTrainsTimer.resume();
				this.updateTrainsIsPaused = false;
			} else {
				this.updateTrainsTimer.pause();
				this.updateTrainsIsPaused = true;
			}
		}
	}

	/**
	 * Get stations and train information when map is loaded
	 * @param trainMap information about the map on load
	 */
	onMapLoad(trainMap: MapBoxMap): void {
		this.sharedDataService.trainMap = trainMap;
		this.isUpdatingMapData = true;
		zip(
			this.sharedDataService.getBasicInformationAboutAllStations(),
			this.sharedDataService.getTrainTracksGeoJSON(),
			this.sharedDataService.getDisruptedTrainTracksGeoJSON(),
			this.sharedDataService.getActiveDisruptions()
		).subscribe({
			next: (value: [StationsResponse, TrainTracksGeoJSON, TrainTracksGeoJSON, DisruptionsList]) => {
				console.log(value);
				this.addStationsToMap(value[0].payload);
				this.trainTracksLayerData = value[1].payload;
				console.log(value[3]);
			},
			error: (err) => {
				console.log(err);
			},
			complete: () => {
				this.updateTrainsAndDisruptions();
			},
		});
	}

	/**
	 * Alter train icon size when zooming on train map
	 * @param event Zoom event
	 */
	onMapZoom(event: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined> & EventData): void {
		const trainLayer = event.target.getLayer("trains");
		if (trainLayer) {
			const zoom = event.target.getZoom();
			// console.log(zoom);
			if (zoom >= 7) {
				const iconSize = zoom * (0.4 / 7);
				event.target.setLayoutProperty("trains", "icon-size", iconSize);
			}
		}
	}

	/**
	 * Change cursor style when hovering over a station or train
	 * @param event Mouse move event
	 */
	onMapMouseMove(event: MapLayerMouseEvent): void {
		const trainLayer = event.target.getLayer("trains");
		if (this.stationsLayerData && this.trainsLayerData && this.trainIconsForMap && trainLayer) {
			const features = event.target.queryRenderedFeatures(event.point, {
				layers: ["trains", "stations"],
			});
			event.target.getCanvas().style.cursor = features.length ? "pointer" : "";
		}
	}

	onMapSourceData(event: MapSourceDataEvent & EventData): void {
		// console.log(event);
		if (event.isSourceLoaded) {
			if (event.sourceId === "trainData" && event.sourceCacheId === "symbol:trainData") {
				// Do something when the source has finished loading
				// console.log(event);
				this._updateTrainPopupInformation();
			}
		}
	}

	changeMapLayerType(layer: TrainMapType): void {
		this.activeMapType = layer;
		if (this.activeMapType.layerId === "storingen-railroad") {
			this.sidebar.sidebarState = "open";
		}
	}

	/**
	 * Open a station popup when clicking on a station
	 * @param event The station
	 */
	openStationPopupOnLayerClick(event: MapLayerMouseEvent): void {
		if (event.features) {
			const selectedFeature: MapboxGeoJSONFeature = event.features[0];
			let stationInformation = selectedFeature.properties;
			/* eslint-disable @typescript-eslint/no-unsafe-assignment */
			stationInformation.namen = JSON.parse(stationInformation.namen);
			stationInformation.synoniemen = JSON.parse(stationInformation.synoniemen);
			stationInformation.sporen = JSON.parse(stationInformation.sporen);
			/* eslint-enable @typescript-eslint/no-unsafe-assignment */
			stationInformation = stationInformation as Station;
			selectedFeature.properties = stationInformation;
			this.sharedDataService.selectedStationOnMapFeature = selectedFeature;
		}
	}

	/**
	 * Open a train popup when clicking on a train
	 * @param event The train
	 */
	openTrainPopupOnLayerClick(event: MapLayerMouseEvent): void {
		if (event.features) {
			const selectedFeature: MapboxGeoJSONFeature = event.features[0];
			const basicTrainInformation = selectedFeature.properties;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			if (basicTrainInformation.trainDetails) {
				basicTrainInformation.trainDetails = JSON.parse(basicTrainInformation.trainDetails);
			}
			selectedFeature.properties = basicTrainInformation;
			this.sharedDataService.selectedTrainOnMapFeature = selectedFeature;
		}
	}

	/**
	 * Close all popups
	 */
	closePopup(): void {
		this.sharedDataService.selectedTrainOnMapFeature = null;
		this.sharedDataService.selectedStationOnMapFeature = null;
	}

	/**
	 * Add stations to the map with GeoJSON
	 * @param stations All stations
	 */
	addStationsToMap(stations: Station[]): void {
		console.log(stations);
		this.stationsLayerData = this.helperFunctions.parseToGeoJSON<Station>(stations, ["lng", "lat"], [], true);
	}

	/**
	 * Add all trains to the map with GeoJSON and resume train updater
	 * @param detailedTrainInformation All trains currently riding
	 */
	addTrainsToMap(detailedTrainInformation: DetailedTrainInformation[]): void {
		this.trainsLayerData = this.helperFunctions.parseToGeoJSON<DetailedTrainInformation>(
			detailedTrainInformation,
			["lng", "lat"],
			[],
			true
		);
	}

	_updateTrainPopupInformation(): void {
		if (this.sharedDataService.selectedTrainOnMapFeature) {
			const selectedFeature = this.sharedDataService.selectedTrainOnMapFeature;
			const oldTrainInformation = selectedFeature.properties as DetailedTrainInformation;
			const rideId = oldTrainInformation.ritId;
			const queriedFeatures = this.sharedDataService.trainMap.querySourceFeatures("trainData", {
				filter: ["==", ["get", "ritId"], rideId],
			});
			if (queriedFeatures && !this.helperFunctions.trainsAreEqual(queriedFeatures[0], oldTrainInformation)) {
				this.closePopup();
				this.openTrainPopupOnLayerClick({
					defaultPrevented: true,
					lngLat: undefined,
					originalEvent: undefined,
					point: undefined,
					// eslint-disable-next-line @typescript-eslint/no-empty-function
					preventDefault(): void {},
					target: undefined,
					type: undefined,
					features: queriedFeatures,
				});
				this.sharedDataService.trainMap.easeTo({
					center: [queriedFeatures[0].properties.lng, queriedFeatures[0].properties.lat],
				});
			} else {
				this.closePopup();
			}
		}
	}

	setDisruptionMarkers(): void {
		const markers: GeoJSON.Feature<GeoJSON.Point, DisruptionBase>[] = [];
		console.log(this.disruptedTrainTracksLayerData.features.length);

		const uniqueDisruptions: GeoJSON.Feature<MultiLineString, { [p: string]: any }>[] = [];
		const idMap = new Map();
		for (const feature of this.disruptedTrainTracksLayerData.features) {
			if (!idMap.has(feature.id)) {
				idMap.set(feature.id, true);
				uniqueDisruptions.push(feature);
			}
		}

		uniqueDisruptions.forEach((feature) => {
			const disruptionInfo = this.sharedDataService.activeDisruptions.find(
				(disruption: DisruptionBase) => disruption.id === feature.id
			);
			if (disruptionInfo) {
				const linePart = feature.geometry.coordinates[0];
				markers.push({
					type: "Feature",
					properties: disruptionInfo,
					geometry: {
						type: "Point",
						coordinates: linePart[Math.ceil(linePart.length / 2) - 1],
					},
				});
			}
		});
		this.sharedDataService.disruptionMarkersData = markers;
	}

	clickMarker(evt: MapMouseEvent): void {
		console.log(evt);
	}

	/**
	 * Get detailed information about all train currently riding
	 * Set train icons when data is received
	 * Get information about active disruptions and add markers
	 */
	updateTrainsAndDisruptions(): void {
		this.isUpdatingMapData = true;
		this.pauseOrResumeUpdatingTrainPositions(true);
		zip(
			this.sharedDataService.getDetailedInformationAboutActiveTrains(),
			this.sharedDataService.getDisruptedTrainTracksGeoJSON(),
			this.sharedDataService.getActiveDisruptions()
		).subscribe({
			next: (value: [DetailedTrainInformation[], TrainTracksGeoJSON, DisruptionsList]) => {
				console.log(value[0]);
				console.log(value[2]);
				this.setTrainIconName(value[0]);
				this.setDisruptionMarkers();
			},
			error: (err) => {
				console.log(err);
			},
			complete: () => {
				console.log("updateTrainsAndDisruptions");
				this.isUpdatingMapData = false;
				this.pauseOrResumeUpdatingTrainPositions(false);
				if (environment.production === false) {
					this.pauseOrResumeUpdatingTrainPositions(true);
				}
			},
		});
	}

	/**
	 * Get information about active disruptions and add markers
	 * NOTE: Specifically used by the sidebar to force an update
	 */
	updateDisruptions(): void {
		zip(
			this.sharedDataService.getDisruptedTrainTracksGeoJSON(true),
			this.sharedDataService.getActiveDisruptions(true)
		).subscribe({
			next: (value: [TrainTracksGeoJSON, DisruptionsList]) => {
				console.log(value[0]);
				console.log(value[1]);
				this.setDisruptionMarkers();
			},
			error: (err) => {
				console.log(err);
			},
			complete: () => {
				console.log("updateDisruptions");
			},
		});
	}

	/**
	 * Add the train icon to the map for each type of train
	 * Add train to map with GeoJSON if icons already have been added
	 * @param detailedTrainInformation Detailed information about all trains
	 */
	setTrainIconName(detailedTrainInformation: DetailedTrainInformation[]): void {
		const iconURLs: Map<string, string> = new Map<string, string>();

		detailedTrainInformation.forEach((train) => {
			let imageName = "alternative";
			let imageURL = "../../assets/alternative-train.png";

			// If train has details about material, add the image url
			if (
				train.trainDetails &&
				train.trainDetails.materieeldelen &&
				train.trainDetails.materieeldelen[0].afbeelding
			) {
				const materiaaldelen = train.trainDetails.materieeldelen;
				// Get last part of url, like 'virm_4.png', to be used as a name
				// console.log(basicTrain);
				const urlParts = materiaaldelen[0].afbeelding.split("/");
				imageName = urlParts[urlParts.length - 1];
				const allIconNames = Array.from(iconURLs.keys());
				// Add the url for an icon name if it has not been added
				if (allIconNames.includes(imageName) === false) {
					const firstTrainPart = materiaaldelen[0];
					if (firstTrainPart.afbeelding) {
						imageURL = firstTrainPart.afbeelding;
					}
					if (firstTrainPart.bakken && firstTrainPart.bakken.length > 0) {
						imageURL = firstTrainPart.bakken[0].afbeelding.url;
					}
					iconURLs.set(imageName, imageURL);
				}
				// Set the icon name for this train
				train.trainIconName = imageName;
			} else {
				// If the train has no details set to alternative and add alternative-train.png
				console.log(train);
				train.trainIconName = imageName;
				iconURLs.set(imageName, imageURL);
			}
		});

		if (this.trainIconsForMap.length === 0) {
			this.getAndAddTrainIconsToMap(iconURLs, detailedTrainInformation);
		} else {
			this.addTrainsToMap(detailedTrainInformation);
		}
	}

	/**
	 * Add train icons to the map
	 * @param iconURLs Icon name and url
	 * @param detailedTrainInformation Detailed information about all trains
	 */
	getAndAddTrainIconsToMap(
		iconURLs: Map<string, string>,
		detailedTrainInformation: DetailedTrainInformation[]
	): void {
		this.imageEditorService.prepareTrainIcons(iconURLs).subscribe({
			next: (result) => {
				result.forEach((image) => {
					this.trainIconNames.add(image.imageName);
					this.trainIconsForMap.push({
						imageName: image.imageName,
						imageObjectURL: window.URL.createObjectURL(new Blob([image.image], { type: "image/png" })),
					});
				});
			},
			complete: () => {
				this.listenForTrainIcons(detailedTrainInformation);
			},
		});
	}

	/**
	 * Listen if all train icons have been added to the map,
	 * then add the trains to the map with GeoJSON
	 * @param detailedTrainInformation Detailed information about all trains
	 */
	listenForTrainIcons(detailedTrainInformation: DetailedTrainInformation[]): void {
		this.trainIconAdded.subscribe({
			next: (trainIconName) => {
				this.trainIconsAdded.add(trainIconName);
				if (this.trainIconNames.size === this.trainIconsAdded.size) {
					this.addTrainsToMap(detailedTrainInformation);
					this.trainIconAddedSource.complete();
				}
			},
			error: (err) => console.log(err),
			complete: () => {
				this.isUpdatingMapData = false;
			},
		});
	}
}
