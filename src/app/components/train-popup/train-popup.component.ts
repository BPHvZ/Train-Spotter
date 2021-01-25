import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter } from "@angular/core";
import { TrainInformation } from "../../models/BasicTrain";
import { MapboxGeoJSONFeature } from "mapbox-gl";

@Component({
	selector: "app-train-popup",
	templateUrl: "./train-popup.component.html",
	styleUrls: ["./train-popup.component.sass"],
})
export class TrainPopupComponent implements OnChanges {
	@Output() public closePopup: EventEmitter<void> = new EventEmitter<void>();
	@Input() mapboxFeature: MapboxGeoJSONFeature;
	trainInformation: TrainInformation;
	directionArrowStyle: Map<string, any> = new Map<string, any>();

	ngOnChanges(changes: SimpleChanges): void {
		console.log(changes);
		if (changes.mapboxFeature.currentValue) {
			this.trainInformation = this.mapboxFeature.properties as TrainInformation;
			this.directionArrowStyle.set("transform", `rotate(${this.trainInformation.richting - 90}deg)`);
		}
	}

	getTypeOfTrain(): string {
		const type = this.trainInformation.type;
		if (type === "SPR") {
			return "Sprinter";
		} else if (type === "IC") {
			return "Intercity";
		} else {
			return type;
		}
	}
}
