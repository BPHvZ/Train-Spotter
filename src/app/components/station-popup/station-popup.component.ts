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
import { Station } from "../../models/ReisinformatieAPI";

/**
 * Show a popup with information about a station on the train map
 */
@Component({
	selector: "app-station-popup",
	templateUrl: "./station-popup.component.html",
	styleUrls: ["./station-popup.component.sass"],
})
export class StationPopupComponent implements OnChanges {
	@Output() public closePopup: EventEmitter<void> = new EventEmitter<void>();
	@Input() mapboxFeature: MapboxGeoJSONFeature;
	stationInformation: Station;

	/**
	 * Set the station information on changes
	 * @param changes Change with station information
	 */
	ngOnChanges(changes: SimpleChanges): void {
		console.log(changes);
		if (changes.mapboxFeature.currentValue) {
			this.stationInformation = this.mapboxFeature.properties as Station;
		}
	}
}
