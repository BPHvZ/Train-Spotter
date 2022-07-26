import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DetailedTrainInformation } from "../../models/VirtualTrainAPI";

/** Show information about a trainset (part of a train) */
@Component({
	selector: "app-trainset-information",
	templateUrl: "./trainset-information.component.html",
	styleUrls: ["./trainset-information.component.sass"],
})
export class TrainsetInformationComponent implements OnInit {
	/**Detailed train information*/
	trainInformation: DetailedTrainInformation;
	/** Number of the trainset */
	trainsetNr: number = null;

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
			this.trainsetNr = Number(params["trainset"]);
			console.log("trainsetNr: ", this.trainsetNr);
		});
		this.route.data.subscribe((resolversData) => {
			this.trainInformation = resolversData["rideInformation"];
		});
	}
}
