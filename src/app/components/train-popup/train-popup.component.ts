import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter } from "@angular/core";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { DetailedTrainInformation } from "../../models/VirtualTrainAPI";
import { HelperFunctionsService } from "../../services/helper-functions.service";

@Component({
	selector: "app-train-popup",
	templateUrl: "./train-popup.component.html",
	styleUrls: ["./train-popup.component.sass"],
})
export class TrainPopupComponent implements OnChanges {
	@Output() public closePopup: EventEmitter<void> = new EventEmitter<void>();
	@Input() mapboxFeature: MapboxGeoJSONFeature;
	trainInformation: DetailedTrainInformation;
	directionArrowStyle: Map<string, any> = new Map<string, any>();

	constructor(private helperFunctions: HelperFunctionsService) {}

	ngOnChanges(changes: SimpleChanges): void {
		console.log(changes);
		if (changes.mapboxFeature.currentValue) {
			this.trainInformation = this.mapboxFeature.properties as DetailedTrainInformation;
			this.directionArrowStyle.set("transform", `rotate(${this.trainInformation.richting - 90}deg)`);
		}
	}

	getTypeOfTrain(): string {
		return this.helperFunctions.getTypeOfTrain(this.trainInformation);
	}
}
