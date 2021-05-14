import { Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { faFrown, faMeh, faSmile, IconDefinition } from "@fortawesome/free-regular-svg-icons";
import lineSplit from "@turf/line-split";
import Timer from "easytimer.js";
import { Feature, FeatureCollection, LineString, Point } from "geojson";
import { LngLatBounds, LngLatBoundsLike, Map as MapBoxMap } from "mapbox-gl";
import { MarkerComponent } from "ngx-mapbox-gl/lib/marker/marker.component";
import { take } from "rxjs/operators";
import { ImageEditorService } from "src/app/services/image-editor.service";
import { RideInformationService } from "src/app/services/ride-information.service";
import { environment } from "../../../environments/environment";
import { Journey, Station } from "../../models/ReisinformatieAPI";
import { JourneyStop, JourneyStops, RideInformation } from "../../models/RideInformation";
import { DetailedTrainInformation, TrainIconOnMap } from "../../models/VirtualTrainAPI";
import { HelperFunctionsService } from "../../services/helper-functions.service";
import { SharedDataService } from "../../services/shared-data.service";

/** Show information about a train */
@Component({
	selector: "app-ride-information",
	templateUrl: "./ride-information.component.html",
	styleUrls: ["./ride-information.component.sass"],
})
export class RideInformationComponent implements OnInit {
	/**countdown DOM element*/
	@ViewChild("updateCountdown") countdown: ElementRef;
	/** Ride information, resolved by browser */
	rideInformation: RideInformation;
	/** Detailed train information */
	trainInformation: DetailedTrainInformation;
	/** Journey details*/
	journey: Journey;
	/** rideId of the train */
	private rideId: number = null;

	journeyMap: MapBoxMap;
	/**Mapbox map style*/
	mapStyle = environment.MAPBOX_STYLE;
	/**Map longitude position*/
	lng = 5.476;
	/**Map latitude position*/
	lat = 52.1284;
	/**Map zoom level*/
	zoom = 6.73;

	// Train tracks layer
	/**Train tracks layer GeoJSON*/
	routeTracksLayerData: FeatureCollection<LineString, any>;
	progressTracksLayerData: FeatureCollection<LineString, any>;
	selectedMarker: MarkerComponent | null;
	stopsLayerData: FeatureCollection<Point, JourneyStop>;
	trainsLayerData: FeatureCollection<Point, DetailedTrainInformation>;
	trainIconOnMap: TrainIconOnMap;
	/**CSS style of the arrow shown in the popup*/
	directionArrowStyle: Map<string, any> = new Map<string, any>();

	// Update data countdown
	/**Is countdown paused*/
	updateTrainsIsPaused = false;
	/**Is currently updating train positions*/
	isUpdatingMapData = false;
	/**Timer that counts down until train data refresh*/
	countdownTimer = new Timer({ countdown: true, startValues: { seconds: 30 } });

	faSmile = faSmile;
	faMeh = faMeh;
	faFrown = faFrown;

	displayedColumns: string[] = ["progress", "aankomst", "vertrek", "station", "perron", "drukte", "afbeelding"];
	dataSource: JourneyStops;
	nextStation: Station;
	passedStations: string[];

	/**
	 * Define services
	 * @param route Current route
	 * @param sharedDataService Shares data through the application
	 * @param helperFunctions Helper functions
	 * @param imageEditorService Web Worker to edit icons
	 * @param renderer Used to modify DOM elements
	 * @param rideInformationService Get ride information about a train
	 */
	constructor(
		private route: ActivatedRoute,
		private sharedDataService: SharedDataService,
		private helperFunctions: HelperFunctionsService,
		private imageEditorService: ImageEditorService,
		private renderer: Renderer2,
		private rideInformationService: RideInformationService
	) {}

	/**
	 * Get ride information from resolve and get route params
	 */
	ngOnInit(): void {
		this.pauseOrResumeUpdatingTrainPositions(true);

		this.route.params.subscribe((params) => {
			this.rideId = Number(params["rideId"]);
			console.log("rideId: ", this.rideId);
		});

		this.route.data.subscribe((resolversData) => {
			const rideInformation = resolversData["rideInformation"];
			this.setRideInformation(rideInformation);
			if (this.rideInformation) {
				this.addTrainToMap();
			}

			this.countdownTimer.addEventListener("targetAchieved", () => {
				// console.log("timer");
				if (this.isUpdatingMapData === false) {
					this.updateRideInformation();
				}
			});
		});
	}

	setRideInformation(rideInformation: RideInformation): void {
		this.rideInformation = rideInformation;
		if (this.rideInformation) {
			// console.log(this.rideInformation);
			this.trainInformation = this.rideInformation.trainInformation;
			this.journey = this.rideInformation.journey;
			this.routeTracksLayerData = this.rideInformation.routeGeoJSON.payload as FeatureCollection<LineString, any>;
			this.dataSource = this.journey.stops.filter((stop) => stop.status != "PASSING");
			this.stopsLayerData = this.helperFunctions.parseToGeoJSON<JourneyStop>(
				this.dataSource,
				["stop.lng", "stop.lat"],
				[],
				true
			);
			this.directionArrowStyle.set("transform", `rotate(${this.trainInformation.richting - 90}deg)`);

			const geoFeature: Feature<Point, any> = {
				geometry: {
					coordinates: [this.trainInformation.lng, this.trainInformation.lat],
					type: "Point",
				},
				properties: {},
				type: "Feature",
			};

			if (this.trainInformation.trainDetails) {
				try {
					this.progressTracksLayerData = lineSplit(
						this.routeTracksLayerData.features[0] as Feature<LineString>,
						geoFeature
					);
					// console.log(this.progressTracksLayerData);
					this.progressTracksLayerData.features.pop();
				} catch (e) {
					console.log(e);
				}

				this.nextStation = this.sharedDataService.findStationByCode(this.trainInformation.trainDetails.station);
				const uicCodes = this.dataSource.map((s) => s.stop["uicCode"] as string);
				let index = uicCodes.indexOf(this.nextStation.UICCode);
				if (index != this.journey.stops.length) index++;
				uicCodes.splice(index, uicCodes.length);
				this.passedStations = uicCodes;
			}
		}
	}

	addTrainToMap(): void {
		let imageName = "alternative";
		let imageURL = "../../assets/alternative-train.png";
		const trainImage = new Map<string, string>();

		// If train has details about material, add the image url
		if (
			this.trainInformation &&
			this.trainInformation.trainDetails.materieeldelen &&
			this.trainInformation.trainDetails.materieeldelen[0].afbeelding
		) {
			const materiaaldelen = this.trainInformation.trainDetails.materieeldelen;
			// Get last part of url, like 'virm_4.png', to be used as a name
			// console.log(basicTrain);
			const urlParts = materiaaldelen[0].afbeelding.split("/");
			imageName = urlParts[urlParts.length - 1];

			const firstTrainPart = materiaaldelen[0];
			if (firstTrainPart.afbeelding) {
				imageURL = firstTrainPart.afbeelding;
			}
			if (firstTrainPart.bakken && firstTrainPart.bakken.length > 0) {
				imageURL = firstTrainPart.bakken[0].afbeelding.url;
			}
		}
		// Set the icon name for this train
		this.trainInformation.trainIconName = imageName;
		trainImage.set(imageName, imageURL);

		this.imageEditorService
			.prepareTrainIcons(trainImage)
			.pipe(take(1))
			.subscribe({
				next: (result) => {
					result.forEach((image) => {
						this.trainIconOnMap = {
							imageName: image.imageName,
							imageObjectURL: window.URL.createObjectURL(new Blob([image.image], { type: "image/png" })),
						};
					});
				},
				complete: () => {
					this.trainsLayerData = this.helperFunctions.parseToGeoJSON<DetailedTrainInformation>(
						[this.trainInformation],
						["lng", "lat"],
						[],
						true
					);
				},
			});
	}

	/**
	 * Get detailed information about all train currently riding
	 * Set train icons when data is received
	 * Get information about active disruptions and add markers
	 */
	private updateRideInformation(): void {
		this.isUpdatingMapData = true;
		this.pauseOrResumeUpdatingTrainPositions(true);
		this.rideInformationService
			.getRideInformation(this.rideId.toString())
			.pipe(take(1))
			.subscribe({
				next: (rideInformation) => {
					this.setRideInformation(rideInformation);
				},
				error: (err: unknown) => {
					console.log(err);
				},
				complete: () => {
					console.log("updateTrainAndJourneyInformation");
					this.isUpdatingMapData = false;
					this.pauseOrResumeUpdatingTrainPositions(false);
				},
			});
	}

	/**
	 * Pause or resume the {@link countdownTimer}
	 * @param pause Whether to pause {@link countdownTimer} or not
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
	/** Reset the countdown visuals */
	resetCountdownProgressbarAnimation(): void {
		this.renderer.removeClass(this.countdown.nativeElement, "progress-value");
		console.log(this.countdown.nativeElement.offsetHeight);
		this.renderer.addClass(this.countdown.nativeElement, "progress-value");
	}
	/* eslint-enable */

	getNumberFromCrowdForecast(forecast: "UNKNOWN" | "LOW" | "MEDIUM" | "HIGH"): Array<IconDefinition> {
		switch (forecast) {
			case "LOW":
				return Array<IconDefinition>(1).fill(faSmile);
			case "MEDIUM":
				return Array<IconDefinition>(2).fill(faMeh);
			case "HIGH":
				return Array<IconDefinition>(3).fill(faFrown);
		}
	}

	/**
	 * Calculate minutes difference between dates
	 * @param planned Planned time
	 * @param actual Actual time
	 * @return number Number of minutes difference
	 */
	minuteDifference(planned: string, actual: string): number {
		const eventStartTime = new Date(planned);
		const eventEndTime = new Date(actual);
		const minutes = (eventEndTime.valueOf() - eventStartTime.valueOf()) / 1000 / 60;
		return Math.round(minutes);
	}

	flyToStation(UICCode: string): void {
		if (UICCode) {
			const station = this.sharedDataService.findStationByUICCode(UICCode);
			if (station) {
				this.sharedDataService.flyToStation(station);
			}
		}
	}

	onMapLoad(map: MapBoxMap): void {
		map.resize();
		this.journeyMap = map;
		const coordinates: LngLatBoundsLike[] = this.routeTracksLayerData.features[0].geometry
			.coordinates as LngLatBoundsLike[];
		const bounds = new LngLatBounds();
		coordinates.forEach((coord) => {
			bounds.extend(coord);
		});
		map.fitBounds(bounds, {
			padding: 20,
		});
	}

	onStopMarkerClick(marker: MarkerComponent): void {
		this.selectedMarker = null;
		this.selectedMarker = marker;
	}
}

// /**
//  * Data source to provide what data should be rendered in the table. Note that the data source
//  * can retrieve its data in any way. In this case, the data source is provided a reference
//  * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
//  * the underlying data. Instead, it only needs to take the data and send the table exactly what
//  * should be rendered.
//  */
// export class ExampleDataSource extends DataSource<PeriodicElement> {
// 	/** Stream of data that is provided to the table. */
// 	data = new BehaviorSubject<PeriodicElement[]>(ELEMENT_DATA);
//
// 	/** Connect function called by the table to retrieve one stream containing the data to render. */
// 	connect(): Observable<PeriodicElement[]> {
// 		return this.data;
// 	}
//
// 	disconnect() {}
// }
