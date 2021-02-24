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

import {
	animate,
	animateChild,
	AnimationEvent,
	group,
	query,
	state,
	style,
	transition,
	trigger,
} from "@angular/animations";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { DisruptionsList } from "../../models/ReisinformatieAPI";
import { SharedDataService } from "../../services/shared-data.service";

@Component({
	selector: "app-train-map-sidebar",
	templateUrl: "./train-map-sidebar.component.html",
	styleUrls: ["./train-map-sidebar.component.sass"],
	animations: [
		trigger("openClose-sidebar", [
			state(
				"open",
				style({
					transform: "translate(0%)",
				})
			),
			state(
				"closed",
				style({
					transform: "translate(100%)",
					boxShadow: "unset",
				})
			),
			transition("open <=> closed", [animate("0.5s cubic-bezier(0.55, 0.31, 0.15, 0.93)")]),
		]),
		trigger("openClose-arrow", [
			state(
				"open",
				style({
					"margin-right": "calc(100% - 30px)",
				})
			),
			state(
				"closed",
				style({
					"margin-right": "0%",
				})
			),
			transition("open <=> closed", [
				group([query("@rotatedState", animateChild()), animate("0.5s cubic-bezier(0.55, 0.31, 0.15, 0.93)")]),
			]),
		]),
		trigger("rotatedState", [
			state("closed", style({ transform: "rotate(90deg)" })),
			state("open", style({ transform: "rotate(-90deg)" })),
			transition("open <=> closed", [animate("0.5s cubic-bezier(0.55, 0.31, 0.15, 0.93)")]),
		]),
	],
})
export class TrainMapSidebarComponent implements OnInit {
	@Output() closeSidebar = new EventEmitter();
	@Output() updateDisruptions = new EventEmitter();
	@Output() clickOnArrow = new EventEmitter<boolean>();

	get disruptions(): DisruptionsList {
		return this.sharedDataService.activeDisruptions;
	}
	lastUpdatedDate?: Date;
	sidebarState = "closed";
	faSyncAlt = faSyncAlt;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.sharedDataService.getActiveDisruptionsLastUpdated$.subscribe((value) => (this.lastUpdatedDate = value));
	}

	changeState(): void {
		this.sidebarState = this.sidebarState === "closed" ? "open" : "closed";
	}

	done(event: AnimationEvent): void {
		if (event.toState === "closed") {
			const element = document.getElementById("sidebar");
			element.style.setProperty("display", "none", "important");
			this.closeSidebar.emit(null);
		}
	}

	setSidebarDisplay(event: AnimationEvent): void {
		const element = document.getElementById("sidebar");
		if (event.toState === "open") {
			element.style.setProperty("display", "block", "important");
		}
	}
}
