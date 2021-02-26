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

import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Disruption, DisruptionBase } from "../../../models/ReisinformatieAPI";
import { SharedDataService } from "../../../services/shared-data.service";

/**
 * Sidebar card item to show a disruption
 * */
@Component({
	selector: "app-disruption-item",
	templateUrl: "./disruption-item.component.html",
	styleUrls: ["./disruption-item.component.sass"],
})
export class DisruptionItemComponent {
	/**Emit event to close the sidebar*/
	@Output() closeSidebar = new EventEmitter();
	/**Disruption information*/
	@Input() disruption: Disruption;

	/**
	 * Define services
	 * @param sharedDataService Shares data through the application
	 */
	constructor(private sharedDataService: SharedDataService) {}

	/**
	 * Fly to a disruption on the map
	 * Close the sidebar on small screens
	 * @param disruption Disruption to fly to
	 */
	flyToDisruption(disruption: DisruptionBase): void {
		if (this.sharedDataService.screenWidth <= 768) {
			this.closeSidebar.emit();
		}
		this.sharedDataService.flyToDisruption(disruption);
	}
}
