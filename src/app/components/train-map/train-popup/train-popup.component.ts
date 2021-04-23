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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faInfoCircle, faShareSquare } from "@fortawesome/free-solid-svg-icons";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { ClipboardService } from "ngx-clipboard";
import { DetailedTrainInformation } from "../../../models/VirtualTrainAPI";
import { HelperFunctionsService } from "../../../services/helper-functions.service";
import { ShareService } from "../../../services/share.service";
import { ToastPosition, ToastService } from "../../../services/toast.service";

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
	faShareSquare = faShareSquare;
	faCopy = faCopy;

	/**
	 * Define services
	 * @param helperFunctions Helper functions
	 * @param router Router object
	 * @param shareService Share using browser Navigator.share
	 * @param toastService Show or delete toast notifications
	 * @param clipboardService Copy to device clipboard
	 */
	constructor(
		private helperFunctions: HelperFunctionsService,
		private router: Router,
		private shareService: ShareService,
		private toastService: ToastService,
		private clipboardService: ClipboardService
	) {}

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

	shareTrain(template: TemplateRef<any>): void {
		const url = `treinenkaart.bartvanzeist.nl/kaart?trein=${this.trainInformation.ritId}`;
		void this.shareService.share(
			{
				url: url,
			},
			() => {
				this.clipboardService.copy(url);
				this.toastService.show(template, ToastPosition.Center);
			}
		);
	}
}
