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

@Component({
	selector: "app-disruption-item",
	templateUrl: "./disruption-item.component.html",
	styleUrls: ["./disruption-item.component.sass"],
})
export class DisruptionItemComponent {
	@Output() closeSidebar = new EventEmitter();
	@Input() disruption: Disruption;

	constructor(private sharedDataService: SharedDataService) {}

	flyToDisruption(disruption: DisruptionBase): void {
		if (this.sharedDataService.screenWidth <= 768) {
			this.closeSidebar.emit();
		}
		this.sharedDataService.flyToDisruption(disruption);
	}
}
