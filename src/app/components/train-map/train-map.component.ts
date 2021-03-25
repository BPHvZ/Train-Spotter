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

import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { Timer } from "easytimer.js";
import { GeoJSON, MultiLineString } from "geojson";
import {
	EventData,
	Map as MapBoxMap,
	MapboxEvent,
	MapboxGeoJSONFeature,
	MapLayerMouseEvent,
	MapMouseEvent,
	MapSourceDataEvent,
} from "mapbox-gl";
import { MarkerComponent } from "ngx-mapbox-gl/lib/marker/marker.component";
import { Observable, Subject, Subscription, zip } from "rxjs";
import { take } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { DisruptionBase, DisruptionsList, Station, StationsResponse } from "../../models/ReisinformatieAPI";
import { SpoortkaartFeatureCollection, TrainTracksGeoJSON } from "../../models/SpoortkaartAPI";
import { TrainMapType } from "../../models/TrainMapType";
import { DetailedTrainInformation, TrainIconOnMap } from "../../models/VirtualTrainAPI";
import { HelperFunctionsService } from "../../services/helper-functions.service";
import { ImageEditorService } from "../../services/image-editor.service";
import { SharedDataService } from "../../services/shared-data.service";

/**
 * Train map with stations and trains that get update every x seconds
 */
@Component({
	selector: "app-train-map",
	templateUrl: "./train-map.component.html",
	styleUrls: ["./train-map.component.sass"],
})
export class TrainMapComponent implements OnInit, OnDestroy {
	@ViewChild("updateCountdown") countdown: ElementRef;

	// MapBox setup
	/**Mapbox map style*/
	mapStyle = environment.MAPBOX_STYLE;
	/**Map longitude position*/
	lng = 5.476;
	/**Map latitude position*/
	lat = 52.1284;
	/**Map zoom level*/
	zoom = 6.73;

	// Map types
	/**
	 * Get current map type
	 * @returns TrainMapType current map type
	 */
	activeMapType$: Observable<TrainMapType> = this.sharedDataService.activeMapType$;
	mapTypesArray = this.sharedDataService.mapTypes;

	// Map popups
	/**
	 * Returns the selected train
	 * @returns MapboxGeoJSONFeature Feature of the selected train
	 */
	get selectedTrainOnMapFeature(): MapboxGeoJSONFeature {
		return this.sharedDataService.selectedTrainOnMapFeature;
	}
	/**
	 * Returns the selected station
	 * @returns MapboxGeoJSONFeature Feature of the selected station
	 */
	get selectedStationOnMapFeature(): MapboxGeoJSONFeature {
		return this.sharedDataService.selectedStationOnMapFeature;
	}

	// Update data countdown
	/**Is countdown paused*/
	updateTrainsIsPaused = false;
	/**Is currently updating train positions*/
	isUpdatingMapData = false;
	countdownTimer = new Timer({ countdown: true, startValues: { seconds: 10 } });

	// Station layer
	/**Station layer GeoJSON*/
	stationsLayerData: GeoJSON.FeatureCollection<GeoJSON.Geometry>;

	// Train tracks layer
	/**Train tracks layer GeoJSON*/
	trainTracksLayerData: SpoortkaartFeatureCollection;

	// Disruptions layer
	/**
	 * Get active disruptions
	 * @returns DisruptionsList List of current disruptions
	 */
	activeDisruptions$: Observable<DisruptionsList> = this.sharedDataService.activeDisruptions$;

	/**
	 * Get train tracks that have disruptions
	 * @returns GeoJSON.FeatureCollection<MultiLineString> GeoJSON data of disrupted train tracks
	 */
	disruptedTrainTracksLayerData$: Observable<TrainTracksGeoJSON> = this.sharedDataService
		.disruptedTrainTracksLayerData$;

	/**
	 * Get markers to place at current disruptions
	 * @returns GeoJSON.Feature<GeoJSON.Point, DisruptionBase>[] GeoJSON data of disruption markers
	 */
	disruptionMarkersData$: Observable<GeoJSON.Feature<GeoJSON.Point, DisruptionBase>[]> = this.sharedDataService
		.disruptionMarkersData$;

	// Trains layer
	/**Trains layer with current trains*/
	trainsLayerData: GeoJSON.FeatureCollection<GeoJSON.Geometry>;

	// Train icons
	/**Observe train icons added to the map*/
	private trainIconAddedSource = new Subject<string>();
	/**Observable to keep tracks of train icons that have been added*/
	trainIconAdded = this.trainIconAddedSource.asObservable();
	/**All train icon names*/
	private trainIconNames: Set<string> = new Set<string>();
	/**Set to store icons names of icons that have been added to the map*/
	private trainIconsAdded: Set<string> = new Set<string>();
	/**Train icons to be added to the map*/
	trainIconsForMap: TrainIconOnMap[] = [];

	subscriptions: Subscription[] = [];

	/**
	 * Define services
	 * @param sharedDataService Shares data through the application
	 * @param helperFunctions Helper functions
	 * @param router Router object
	 * @param imageEditorService Web Worker to edit icons
	 */
	constructor(
		private sharedDataService: SharedDataService,
		private helperFunctions: HelperFunctionsService,
		private router: Router,
		private imageEditorService: ImageEditorService,
		private renderer: Renderer2
	) {}

	/**
	 * Fly to station when this component is reused and navigated to from another component with extra state parameters
	 */
	ngOnInit(): void {
		this.pauseOrResumeUpdatingTrainPositions(true);

		const sub1 = this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				// console.log(event.url);
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
		this.subscriptions.push(sub1);

		this.countdownTimer.addEventListener("targetAchieved", (e) => {
			console.log("timer");
			if (this.isUpdatingMapData === false) {
				this.updateTrainsAndDisruptions();
			}
		});
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach((subscription) => subscription.unsubscribe());
	}

	/**
	 * Emit an event when a train icon has been loaded
	 * @param trainIconName Name of the icon that has been loaded
	 */
	onIconLoad(trainIconName: string): void {
		this.trainIconAddedSource.next(trainIconName);
	}

	/**
	 * Pause or resume the {@link updateTrainsTimer}
	 * @param pause Whether to pause {@link updateTrainsTimer} or not
	 */
	pauseOrResumeUpdatingTrainPositions(pause: boolean): void {
		if (this.isUpdatingMapData === false) {
			if (pause === false) {
				if (this.countdownTimer.getTimeValues().seconds <= 0) {
					this.resetCountdownProgressbarAnimation();
				}
				this.countdownTimer.start();
				this.updateTrainsIsPaused = false;
			} else {
				this.countdownTimer.pause();
				this.updateTrainsIsPaused = true;
			}
		}
	}

	/* eslint-disable */
	resetCountdownProgressbarAnimation(): void {
		this.renderer.removeClass(this.countdown.nativeElement, "progress-value");
		console.log(this.countdown.nativeElement.offsetHeight);
		this.renderer.addClass(this.countdown.nativeElement, "progress-value");
	}
	/* eslint-enable */

	/**
	 * Get station, train and disruption information when map is loaded
	 * @param trainMap Mapbox map
	 */
	onMapLoad(trainMap: MapBoxMap): void {
		this.sharedDataService.trainMap = trainMap;
		trainMap.resize();
		this.isUpdatingMapData = true;
		zip(
			this.sharedDataService.getBasicInformationAboutAllStations(),
			this.sharedDataService.getTrainTracksGeoJSON(),
			this.sharedDataService.updateDisruptedTrainTracksGeoJSON(),
			this.sharedDataService.updateActiveDisruptions()
		)
			.pipe(take(1))
			.subscribe({
				next: (value: [StationsResponse, TrainTracksGeoJSON, void, void]) => {
					console.log(value);
					this.addStationsToMap(value[0].payload);
					this.trainTracksLayerData = value[1].payload;
				},
				error: (err) => {
					console.log(err);
				},
				complete: () => {
					this.updateTrainsAndDisruptions();
				},
			});

		// Add rel=noopener to mapbox links. Lighthouse improvement
		const children = document.querySelector(".mapboxgl-ctrl-attrib-inner").children;
		for (let i = 0; i < children.length; i++) {
			children[i].setAttribute("rel", "noopener");
			children[i].setAttribute("role", "listitem");
		}
	}

	/**
	 * Alter train icon size when the map is zoomed
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
	 * @param event Mouse event
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

	/**
	 * Track when layer source data is updated
	 * Update an active train popup with new data
	 * @param event Map source data event
	 */
	onMapSourceData(event: MapSourceDataEvent & EventData): void {
		if (event.isSourceLoaded) {
			if (event.sourceId === "trainData" && event.sourceCacheId === "symbol:trainData") {
				this._updateTrainPopupInformation();
			}
		}
	}

	/**
	 * Change the map {@link mapTypes}
	 * @param layer Map type to change to
	 */
	changeMapLayerType(layer: TrainMapType): void {
		console.log(layer);
		this.sharedDataService.changeMapLayerType(layer);
	}

	/**
	 * Receive an event when a Mapbox popup is closed
	 * Clear the popup data
	 */
	onPopupClose(): void {
		this.sharedDataService.closePopups();
	}

	/**
	 * Open a station popup when clicking on a station
	 * @param event Map layer event to extract the station from
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
	 * @param event Map layer event to extract the train from
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
	 * Add stations to the map using GeoJSON
	 * @param stations All stations
	 */
	private addStationsToMap(stations: Station[]): void {
		console.log(stations);
		this.stationsLayerData = this.helperFunctions.parseToGeoJSON<Station>(stations, ["lng", "lat"], [], true);
	}

	/**
	 * Add all trains to the map with GeoJSON
	 * @param detailedTrainInformation All current trains, with detailed information
	 */
	private addTrainsToMap(detailedTrainInformation: DetailedTrainInformation[]): void {
		this.trainsLayerData = this.helperFunctions.parseToGeoJSON<DetailedTrainInformation>(
			detailedTrainInformation,
			["lng", "lat"],
			[],
			true
		);
		this.isUpdatingMapData = false;
		this.pauseOrResumeUpdatingTrainPositions(false);
		if (environment.production === false) {
			this.pauseOrResumeUpdatingTrainPositions(true);
		}
	}

	/**
	 * Update a train popup with new information
	 */
	private _updateTrainPopupInformation(): void {
		if (this.sharedDataService.selectedTrainOnMapFeature) {
			const selectedFeature = this.sharedDataService.selectedTrainOnMapFeature;
			const oldTrainInformation = selectedFeature.properties as DetailedTrainInformation;
			const rideId = oldTrainInformation.ritId;
			const queriedFeatures = this.sharedDataService.trainMap.querySourceFeatures("trainData", {
				filter: ["==", ["get", "ritId"], rideId],
			});
			if (queriedFeatures && !this.helperFunctions.objectsAreEqual(queriedFeatures[0], oldTrainInformation)) {
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

	/**
	 * Set the disruption markers for each disruption
	 */
	private setDisruptionMarkers(): void {
		const markers: GeoJSON.Feature<GeoJSON.Point, DisruptionBase>[] = [];

		const uniqueDisruptions: GeoJSON.Feature<MultiLineString, { [p: string]: any }>[] = [];
		const idMap = new Map();
		const features = this.sharedDataService.disruptedTrainTracksLayerDataLastValue().features;
		for (const feature of features) {
			if (!idMap.has(feature.id)) {
				idMap.set(feature.id, true);
				uniqueDisruptions.push(feature);
			}
		}

		uniqueDisruptions.forEach((feature) => {
			const disruptionInfo = this.sharedDataService
				.activeDisruptionsLastValue()
				.find((disruption: DisruptionBase) => disruption.id === feature.id);
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
		this.sharedDataService.updateDisruptionMarkersData(markers);
	}

	/**
	 * Event when a disruption marker is clicked
	 * @param event Map mouse event
	 */
	clickMarker(event: MapMouseEvent): void {
		console.log(event);
	}

	/**
	 * Get detailed information about all train currently riding
	 * Set train icons when data is received
	 * Get information about active disruptions and add markers
	 */
	private updateTrainsAndDisruptions(): void {
		this.isUpdatingMapData = true;
		this.pauseOrResumeUpdatingTrainPositions(true);
		zip(
			this.sharedDataService.updateDetailedInformationAboutActiveTrains(),
			this.sharedDataService.updateDisruptedTrainTracksGeoJSON(),
			this.sharedDataService.updateActiveDisruptions()
		)
			.pipe(take(1))
			.subscribe({
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				next: (_) => {
					this.setTrainIconName(this.sharedDataService.trainInformationLastValue());
					this.setDisruptionMarkers();
				},
				error: (err) => {
					console.log(err);
				},
				complete: () => {
					console.log("updateTrainsAndDisruptions");
				},
			});
	}

	/**
	 * Get and update information about active disruptions and add markers
	 * NOTE: Specifically used by the sidebar to force an update
	 */
	updateDisruptions(): void {
		zip(
			this.sharedDataService.updateDisruptedTrainTracksGeoJSON(true),
			this.sharedDataService.updateActiveDisruptions(true)
		)
			.pipe(take(1))
			.subscribe({
				error: (err) => {
					console.log(err);
				},
				complete: () => {
					console.log("updateDisruptions");
					this.setDisruptionMarkers();
				},
			});
	}

	/**
	 * Add the train icon to the map for each type of train
	 * Set the icon name for each train by train type
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
	 * Download and edit train icons. Add them to the map
	 * @param iconURLs Icon name and url
	 * @param detailedTrainInformation Detailed information about all trains
	 */
	getAndAddTrainIconsToMap(
		iconURLs: Map<string, string>,
		detailedTrainInformation: DetailedTrainInformation[]
	): void {
		this.imageEditorService
			.prepareTrainIcons(iconURLs)
			.pipe(take(1))
			.subscribe({
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
	 * then add the trains to the map with GeoJSON and stop the updating process.
	 * @param detailedTrainInformation Detailed information about all trains
	 */
	listenForTrainIcons(detailedTrainInformation: DetailedTrainInformation[]): void {
		this.trainIconAdded.pipe(take(1)).subscribe({
			next: (trainIconName) => {
				this.trainIconsAdded.add(trainIconName);
				if (this.trainIconNames.size === this.trainIconsAdded.size) {
					this.trainIconAddedSource.complete();
				}
			},
			error: (err) => console.log(err),
			complete: () => {
				this.addTrainsToMap(detailedTrainInformation);
			},
		});
	}

	addMarkerComponentToSet(marker: MarkerComponent): () => void {
		return () => {
			this.sharedDataService.disruptionMarkerElements.add(marker);
		};
	}

	onMouseEnterDisruptionMarker(event: MouseEvent, disruption: DisruptionBase, markerElement: MarkerComponent): void {
		// find disruption in sidebar and focus
		event.preventDefault();
		const cards = Array.from(this.sharedDataService.disruptionCardElements);
		const card = cards.find((c) => c.id == disruption.id);
		if (card) {
			const cardElement = this.renderer.selectRootElement(card.element.nativeElement, true) as HTMLElement;
			setTimeout(() => {
				cardElement.parentElement.focus();
				this.renderer.setStyle(markerElement.content.nativeElement, "zIndex", 1);
			}, 0);
		}
		event.preventDefault();
	}

	/**
	 * Fly to a disruption on the map
	 * @param disruption Disruption to fly to
	 */
	flyToDisruption(disruption: DisruptionBase): void {
		this.sharedDataService.flyToDisruption(disruption);
	}

	onMouseLeaveDisruptionMarker(event: MouseEvent, disruption: DisruptionBase, markerElement: MarkerComponent): void {
		// find disruption in sidebar and unfocus
		event.preventDefault();
		const cards = Array.from(this.sharedDataService.disruptionCardElements);
		const card = cards.find((c) => c.id == disruption.id);
		if (card) {
			const cardElement = this.renderer.selectRootElement(card.element.nativeElement, true) as HTMLElement;
			setTimeout(() => {
				cardElement.parentElement.blur();
				this.renderer.setStyle(markerElement.content.nativeElement, "zIndex", "unset");
			}, 0);
		}
		event.preventDefault();
	}
}
