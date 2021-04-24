import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DetailedTrainInformation } from "../../models/VirtualTrainAPI";

/** Show information about a train */
@Component({
	selector: "app-ride-information",
	templateUrl: "./ride-information.component.html",
	styleUrls: ["./ride-information.component.sass"],
})
export class RideInformationComponent implements OnInit {
	/** Detailed train information */
	trainInformation: DetailedTrainInformation;
	/** rideId of the train */
	private rideId: number = null;

	/**
	 * Define services
	 * @param route Current route
	 */
	constructor(private route: ActivatedRoute) {}

	/**
	 * Get ride information from resolve and get route params
	 */
	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.rideId = Number(params["rideId"]);
			console.log("rideId: ", this.rideId);
		});
		this.trainInformation = this.route.snapshot.data["rideInformation"];
	}
}
