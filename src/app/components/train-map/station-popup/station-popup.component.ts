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
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { Observable, zip } from "rxjs";
import { map, take, tap } from "rxjs/operators";
import { Station, StationArrivalsList, StationDeparturesList } from "../../../models/ReisinformatieAPI";
import { ApiService } from "../../../services/api.service";
import { SharedDataService } from "../../../services/shared-data.service";

/**
 * Show a popup with information about a station on the map
 */
@Component({
	selector: "app-station-popup",
	templateUrl: "./station-popup.component.html",
	styleUrls: ["./station-popup.component.sass"],
})
export class StationPopupComponent implements OnChanges {
	/**Notify the map when to close the popup*/
	@Output() public closePopup: EventEmitter<void> = new EventEmitter<void>();
	/**The Mapbox Feature of the station*/
	@Input() mapboxFeature: MapboxGeoJSONFeature;
	/**The selected station*/
	stationInformation: Station;
	/**FontAwesome crosshair icon*/
	faCrosshairs = faCrosshairs;

	/**Arrival and departure information of the station*/
	stationArrivalsAndDepartures$: Observable<[StationArrivalsList, StationDeparturesList]>;
	/**Calculated delays of the arrivals*/
	arrivalDelays: Map<string, number> = new Map();
	/**Calculated delays of the departures*/
	departureDelays: Map<string, number> = new Map();
	/**State which table is currently shown*/
	activeTable: "arrivals" | "departures" = "arrivals";

	/**
	 * Define services
	 * @param apiService Requests for NS API
	 * @param sharedDataService Shares data through the application
	 */
	constructor(private apiService: ApiService, private sharedDataService: SharedDataService) {}

	/**
	 * Set the station information on changes
	 * @param changes New station to show the popup of
	 */
	ngOnChanges(changes: SimpleChanges): void {
		if (changes.mapboxFeature.currentValue) {
			this.stationInformation = this.mapboxFeature.properties as Station;
			this.activeTable = "arrivals";
			this.stationArrivalsAndDepartures$ = zip(
				this.apiService.getStationArrivals(this.stationInformation.UICCode, 3),
				this.apiService.getStationDepartures(this.stationInformation.UICCode, 3)
			).pipe(
				take(1),
				tap((responses) => {
					const arrivalsResponse = responses[0];
					const departuresResponse = responses[1];

					// console.log(arrivalsResponse?.data?.payload);
					// console.log(departuresResponse?.data?.payload);
					this.arrivalDelays.clear();

					arrivalsResponse?.data?.payload?.arrivals?.forEach((arrival) => {
						if (arrival.plannedDateTime && arrival.actualDateTime) {
							this.arrivalDelays[arrival.name] = this.minuteDifference(
								arrival.plannedDateTime,
								arrival.actualDateTime
							);
						}
					});

					departuresResponse?.data?.payload?.departures?.forEach((departure) => {
						if (departure.plannedDateTime && departure.actualDateTime) {
							this.departureDelays[departure.name] = this.minuteDifference(
								departure.plannedDateTime,
								departure.actualDateTime
							);
						}
					});
				}),
				map((responses) => {
					return [responses[0].data?.payload?.arrivals, responses[1].data?.payload?.departures];
				})
			);
		}
	}

	/**
	 * Calculate minutes difference between dates
	 * @param planned Planned time
	 * @param actual Actual time
	 * @return number Number of minutes difference
	 */
	minuteDifference(planned: string, actual: string): number {
		const eventStartTime = new Date(planned);
		const eventEndTime = new Date(actual);
		const minutes = (eventEndTime.valueOf() - eventStartTime.valueOf()) / 1000 / 60;
		return Math.round(minutes);
	}

	/**
	 * Find the train by ride id and fly to it
	 * @param number Ride id of the train
	 */
	flyToTrainByNumber(number: string): void {
		if (number) {
			const trainDetails = this.sharedDataService.findTrainByRideId(number);
			if (trainDetails) {
				this.sharedDataService.flyToTrain(trainDetails);
			}
		}
	}
}
