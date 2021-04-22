import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DetailedTrainInformation } from "../../models/VirtualTrainAPI";

@Component({
	selector: "app-ride-information",
	templateUrl: "./ride-information.component.html",
	styleUrls: ["./ride-information.component.sass"],
})
export class RideInformationComponent implements OnInit {
	/**Detailed train information*/
	trainInformation: DetailedTrainInformation;

	private rideId: number = null;

	constructor(private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.rideId = Number(params["rideId"]);
			console.log("rideId: ", this.rideId);
		});
		this.trainInformation = this.route.snapshot.data["rideInformation"];
	}
}
