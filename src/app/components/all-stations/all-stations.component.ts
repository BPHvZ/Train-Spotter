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

import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { Router } from "@angular/router";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { NgbdSortableHeaderDirective, SortEvent } from "../../directives/ngbd-sortable-header.directive";
import { Station } from "../../models/ReisinformatieAPI";
import { StationsService } from "../../services/stations.service";

/**
 * Table with all NS-stations
 */
@Component({
	selector: "app-all-stations",
	templateUrl: "./all-stations.component.html",
	styleUrls: ["./all-stations.component.sass"],
	providers: [StationsService],
})
export class AllStationsComponent implements OnInit {
	/**Stations received as search result from {@link StationsService}*/
	stations$: Observable<Station[]>;
	/**Number of stations found*/
	total$: Observable<number>;
	/**FontAwesome Crosshair icon*/
	faCrosshairs = faCrosshairs;

	/**Header of the table*/
	@ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>;

	/**
	 * Set listeners
	 * @param stationsService Used to search for stations
	 * @param router Used to navigate to the map
	 */
	constructor(private stationsService: StationsService, private router: Router) {
		this.stations$ = stationsService.stations$;
		this.total$ = stationsService.total$;
	}

	/**
	 * Getter for the StationsService
	 * @returns StationsService
	 */
	getStationsService(): StationsService {
		return this.stationsService;
	}

	/**Sort ascending on name*/
	ngOnInit(): void {
		// only take the first two events, then unsubscribe
		this.stationsService.stations$.pipe(take(2)).subscribe((r) => {
			if (r.length > 0) {
				this.headers.first.rotate();
			}
		});
	}

	/**
	 * Sort when table column header is clicked
	 * @param column Property name of {@link Station} to sort on
	 * @param direction Sort ascending or descending
	 */
	onSort({ column, direction }: SortEvent): void {
		// resetting other headers
		this.headers.forEach((header) => {
			if (header.appNgbdSortableHeader !== column) {
				header.direction = "";
			}
		});
		this.stationsService.sortColumn = column;
		this.stationsService.sortDirection = direction;
	}

	/**
	 * Change view to the train map and fly to a station
	 * @param station Fly to this station
	 */
	openStationOnMap(station: Station): void {
		void this.router.navigate(["kaart"], { state: { station } });
	}
}
