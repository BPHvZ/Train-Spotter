import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DetailedTrainInformation } from "../../models/VirtualTrainAPI";

@Component({
	selector: "app-trainset-information",
	templateUrl: "./trainset-information.component.html",
	styleUrls: ["./trainset-information.component.sass"],
})
export class TrainsetInformationComponent implements OnInit {
	/**Detailed train information*/
	trainInformation: DetailedTrainInformation;
	trainsetNr: number = null;

	constructor(private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.trainsetNr = Number(params["trainset"]);
			console.log("trainsetNr: ", this.trainsetNr);
		});
		this.trainInformation = this.route.snapshot.data["rideInformation"];
	}
}
