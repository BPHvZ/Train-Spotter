import { Component, OnInit, ViewChild } from "@angular/core";
import { TrainMapType } from "../../models/TrainMapType";
import { forkJoin, from, interval, Observable, PartialObserver, Subject, zip } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { pausable, PausableObservable } from "rxjs-pausable";
import { ApiService } from "../../services/api.service";
import { HelperFunctionsService } from "../../services/helper-functions.service";
import { GeoJSON, MultiLineString } from "geojson";
import { environment } from "../../../environments/environment";
import Jimp from "jimp";
import {
	EventData,
	LngLatLike,
	Map as MapBoxMap,
	MapboxEvent,
	MapboxGeoJSONFeature,
	MapLayerMouseEvent,
	MapMouseEvent,
	MapSourceDataEvent,
	SymbolLayout,
} from "mapbox-gl";
import { HeaderEventsService } from "../../services/header-events.service";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { TrainMapSidebarComponent } from "../train-map-sidebar/train-map-sidebar.component";
import { DisruptionBase, DisruptionsList, Station, StationsResponse } from "../../models/ReisinformatieAPI";
import { SpoortkaartFeatureCollection, TrainTracksGeoJSON } from "../../models/SpoortkaartAPI";
import { DetailedTrainInformation, Train, TrainIconOnMap, TrainInformation } from "../../models/VirtualTrainAPI";
import { SharedDataService } from "../../services/shared-data.service";

// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
const replaceColor = require("replace-color");

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
	disruptedTrainTracksLayerData: GeoJSON.FeatureCollection<MultiLineString>;
	actualDisruptions: DisruptionsList;
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
		// private apiService: ApiService,
		private sharedDataService: SharedDataService,
		private helperFunctions: HelperFunctionsService,
		private headerEventsService: HeaderEventsService,
		private router: Router
	) {}

	/**
	 * Set {@link updateTrainsTimer} and {@link progressNum}
	 * Fly to station when {@link HeaderEventsService.currentSelectedStation} receives an event
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
						this.getActiveTrainsAndDetails();
					}
				}
			},
		};
		this.updateTrainsTimer.subscribe(this.timerObserver);
		this.headerEventsService.currentSelectedStation.subscribe((station) =>
			this.sharedDataService.flyToStation(station)
		);

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
				this.disruptedTrainTracksLayerData = value[2].payload as GeoJSON.FeatureCollection<MultiLineString>;
				this.actualDisruptions = value[3];
				console.log(value[3]);
			},
			error: (err) => {
				console.log(err);
			},
			complete: () => {
				this.getActiveTrainsAndDetails();
				this.setDisruptionMarkers();
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
		this.isUpdatingMapData = false;
		this.pauseOrResumeUpdatingTrainPositions(false);
		if (environment.production === false) {
			this.pauseOrResumeUpdatingTrainPositions(true);
		}
	}

	_updateTrainPopupInformation(): void {
		if (this.sharedDataService.selectedTrainOnMapFeature) {
			const selectedFeature = this.sharedDataService.selectedTrainOnMapFeature;
			const oldTrainInformation = selectedFeature.properties as DetailedTrainInformation;
			const rideId = oldTrainInformation.ritId;
			const queriedFeatures = this.sharedDataService.trainMap.querySourceFeatures("trainData", {
				filter: ["==", ["get", "ritId"], rideId],
			});
			if (queriedFeatures) {
				this.closePopup();
				this.openTrainPopupOnLayerClick({
					defaultPrevented: false,
					lngLat: undefined,
					originalEvent: undefined,
					point: undefined,
					// eslint-disable-next-line @typescript-eslint/no-empty-function
					preventDefault(): void {},
					target: undefined,
					type: undefined,
					features: queriedFeatures,
				});
			} else {
				this.closePopup();
			}
		}
	}

	setDisruptionMarkers(): void {
		this.sharedDataService.disruptionMarkersData = [];
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
			const disruptionInfo = this.actualDisruptions.find(
				(disruption: DisruptionBase) => disruption.id === feature.id
			);
			if (disruptionInfo) {
				const linePart = feature.geometry.coordinates[0];
				this.sharedDataService.disruptionMarkersData.push({
					type: "Feature",
					properties: disruptionInfo,
					geometry: {
						type: "Point",
						coordinates: linePart[Math.ceil(linePart.length / 2) - 1],
					},
				});
			}
		});
	}

	clickMarker(evt: MapMouseEvent): void {
		console.log(evt);
	}

	/**
	 * Get detailed information about all train currently riding
	 * Set train icons when data is received
	 */
	getActiveTrainsAndDetails(): void {
		this.isUpdatingMapData = true;
		this.pauseOrResumeUpdatingTrainPositions(true);
		this.sharedDataService.getDetailedInformationAboutActiveTrains().subscribe({
			next: (detailedTrainInformation) => {
				console.log(detailedTrainInformation);
				this.setTrainIconName(detailedTrainInformation);
			},
			error: (err) => {
				console.log(err);
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
		const jimpImageNames: string[] = [];
		const jimpBufferObservables: Observable<Buffer>[] = [];

		iconURLs.forEach((imageURL, imageName) => {
			jimpImageNames.push(imageName);
			jimpBufferObservables.push(
				from(Jimp.read(imageURL)).pipe(
					mergeMap<Jimp, Observable<Buffer>>((image) => {
						image.resize(Jimp.AUTO, 50).crop(0, 0, 100, 50);
						if (image.hasAlpha()) {
							image.rgba(true).background(0x000000ff);
						}
						return from(image.getBufferAsync(Jimp.MIME_PNG));
					}),
					mergeMap((buffer) =>
						from<Observable<Jimp>>(
							// eslint-disable-next-line @typescript-eslint/no-unsafe-call
							replaceColor({
								image: buffer,
								colors: {
									type: "hex",
									targetColor: "#FFFFFF",
									replaceColor: "#00000000",
								},
							})
						)
					),
					mergeMap((image) => image.getBufferAsync(Jimp.MIME_PNG))
				)
			);
		});

		forkJoin(jimpBufferObservables).subscribe({
			next: (buffers) => {
				buffers.forEach((buffer, index) => {
					this.trainIconNames.add(jimpImageNames[index]);
					this.trainIconsForMap.push({
						imageName: jimpImageNames[index],
						imageObjectURL: window.URL.createObjectURL(new Blob([buffer], { type: "image/png" })),
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
