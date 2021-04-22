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
import { Router } from "@angular/router";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { DetailedTrainInformation } from "../../../models/VirtualTrainAPI";
import { HelperFunctionsService } from "../../../services/helper-functions.service";

/**
 * Show a popup with information about a train on the map
 */
@Component({
	selector: "app-train-popup",
	templateUrl: "./train-popup.component.html",
	styleUrls: ["./train-popup.component.sass"],
})
export class TrainPopupComponent implements OnChanges {
	/**Notify the map to close the popup*/
	@Output() public closePopup: EventEmitter<void> = new EventEmitter<void>();
	/**Mapbox Feature of this train*/
	@Input() mapboxFeature: MapboxGeoJSONFeature;
	/**Detailed train information*/
	trainInformation: DetailedTrainInformation;
	/**CSS style of the arrow shown in the popup*/
	directionArrowStyle: Map<string, any> = new Map<string, any>();
	updatedAt: Date;
	faInfoCircle = faInfoCircle;

	/**
	 * Define services
	 * @param helperFunctions Helper functions
	 * @param router Router object
	 */
	constructor(private helperFunctions: HelperFunctionsService, private router: Router) {}

	/**
	 * Update the train information
	 * Update the arrow rotation
	 * @param changes Updated train information
	 */
	ngOnChanges(changes: SimpleChanges): void {
		console.log(changes);
		if (changes.mapboxFeature.currentValue) {
			this.trainInformation = this.mapboxFeature.properties as DetailedTrainInformation;
			this.directionArrowStyle.set("transform", `rotate(${this.trainInformation.richting - 90}deg)`);
			this.updatedAt = new Date(this.trainInformation?.updatedAt);
		}
	}

	/**
	 * Get the type of train as full words
	 * @returns string Train type
	 */
	getTypeOfTrain(): string {
		return this.helperFunctions.getTypeOfTrain(this.trainInformation);
	}

	navigateToRideInformation(): void {
		void this.router.navigate(["/rit", this.trainInformation.ritId]);
	}

	navigateToTrainsetInformation(trainsetNr: number): void {
		void this.router.navigate(["/materiaal", trainsetNr], {
			queryParams: { rideId: this.trainInformation.ritId },
		});
	}
}
