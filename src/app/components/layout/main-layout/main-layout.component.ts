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

import { Component } from "@angular/core";
import { Router } from "@angular/router";

/**
 * Main layout of the application
 */
@Component({
	selector: "app-main-layout",
	templateUrl: "./main-layout.component.html",
	styleUrls: ["./main-layout.component.sass"],
})
export class MainLayoutComponent {
	isTrainMap = false;

	constructor(private router: Router) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		router.events.subscribe((_) => {
			// if on train map remove padding
			this.isTrainMap = router.url.endsWith("kaart");
		});
	}

	removePaddingOnMap(): string {
		if (this.isTrainMap) {
			return "1.333rem";
		}
	}
}
