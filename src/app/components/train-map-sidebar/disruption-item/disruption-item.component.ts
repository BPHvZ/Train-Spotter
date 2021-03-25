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

import { AfterViewInit, Component, ElementRef, Input } from "@angular/core";
import { Disruption } from "../../../models/ReisinformatieAPI";
import { SharedDataService } from "../../../services/shared-data.service";

export interface DisruptionCard {
	id: string;
	element: ElementRef;
}

/**
 * Sidebar card item to show a disruption
 * */
@Component({
	selector: "app-disruption-item",
	templateUrl: "./disruption-item.component.html",
	styleUrls: ["./disruption-item.component.sass"],
})
export class DisruptionItemComponent implements AfterViewInit {
	/**Disruption information*/
	@Input() disruption: Disruption;

	/**
	 * Define services
	 * @param sharedDataService Shares data through the application
	 * @param cardElement DOM element
	 */
	constructor(private sharedDataService: SharedDataService, private cardElement: ElementRef) {}

	ngAfterViewInit(): void {
		this.sharedDataService.disruptionCardElements.add({
			id: this.disruption.id,
			element: this.cardElement,
		});
	}
}
