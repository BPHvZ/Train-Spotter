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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
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
