import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { faFrown, faMeh, faSmile, IconDefinition } from "@fortawesome/free-regular-svg-icons";
import { Journey, Station } from "../../models/ReisinformatieAPI";
import { JourneyStops, RideInformation } from "../../models/RideInformation";
import { DetailedTrainInformation } from "../../models/VirtualTrainAPI";
import { SharedDataService } from "../../services/shared-data.service";

/** Show information about a train */
@Component({
	selector: "app-ride-information",
	templateUrl: "./ride-information.component.html",
	styleUrls: ["./ride-information.component.sass"],
})
export class RideInformationComponent implements OnInit {
	/** Ride information, resolved by browser */
	rideInformation: RideInformation;
	/** Detailed train information */
	trainInformation: DetailedTrainInformation;
	/** Journey details*/
	journey: Journey;
	/** rideId of the train */
	private rideId: number = null;

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
	 */
	constructor(private route: ActivatedRoute, private sharedDataService: SharedDataService) {}

	/**
	 * Get ride information from resolve and get route params
	 */
	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.rideId = Number(params["rideId"]);
			console.log("rideId: ", this.rideId);
		});
		this.rideInformation = this.route.snapshot.data["rideInformation"];
		this.trainInformation = this.rideInformation.trainInformation;
		this.journey = this.rideInformation.journey;
		this.dataSource = this.journey.stops.filter((stop) => stop.status != "PASSING");
		if (this.trainInformation.trainDetails) {
			this.nextStation = this.sharedDataService.findStationByCode(this.trainInformation.trainDetails.station);
			const stops = this.journey.stops.filter((s) => {
				if (s.status != "PASSING") return s;
			});
			const uicCodes = stops.map((s) => s.stop["uicCode"] as string);
			let index = uicCodes.indexOf(this.nextStation.UICCode);
			if (index != this.journey.stops.length) index++;
			uicCodes.splice(index, uicCodes.length);
			this.passedStations = uicCodes;
		}
	}

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

	flyToStation(UICCode: string): void {
		if (UICCode) {
			const station = this.sharedDataService.findStationByUICCode(UICCode);
			if (station) {
				this.sharedDataService.flyToStation(station);
			}
		}
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
