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

/* eslint-disable */
import { Component } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";

/**
 * TrainSpotter starting point
 */
@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.sass"],
})
export class AppComponent {
	/**
	 * Define services
	 * Refresh the page when a new version of TrainSpotter is available
	 * @param updates Service Worker service
	 */
	constructor(private updates: SwUpdate) {
		updates.available.subscribe(() => {
			console.log("updated");
			updates.activateUpdate().then(() => document.location.reload());
		});
		updates.unrecoverable.subscribe((event) => {
			document.location.reload();
		});
	}
}
