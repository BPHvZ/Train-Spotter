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
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { Observable } from "rxjs";
import { DisruptionsList } from "../../models/ReisinformatieAPI";
import { SharedDataService } from "../../services/shared-data.service";

/**
 * Sidebar with disruption information
 * */
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
export class TrainMapSidebarComponent {
	/**Active disruptions*/
	@Input() activeDisruptions: DisruptionsList;
	/**Notify train map component to force update disruptions*/
	@Output() updateDisruptions = new EventEmitter();
	/**Notify when sidebar opens and closes*/
	@Output() clickOnArrow = new EventEmitter<boolean>();

	/**Sidebar open/closed state*/
	sidebarState = "closed";
	/**FontAwesome sync icon*/
	faSyncAlt = faSyncAlt;

	/**Date when disruptions have been last updated*/
	disruptionsLastUpdated$: Observable<Date> = this.sharedDataService.disruptionsLastUpdated$;

	/**
	 * Define services
	 * @param sharedDataService Shares data through the application
	 */
	constructor(private sharedDataService: SharedDataService) {}

	/**
	 * Open or close the sidebar
	 */
	changeState(): void {
		this.sidebarState = this.sidebarState === "closed" ? "open" : "closed";
	}

	/**
	 * Is run when the sidebar animation has finished
	 * Sets the css display mode to none to not occupy space on the train map
	 * NOTE: without this, the area of the open sidebar can not be interacted with
	 * @param event Animation event
	 */
	sidebarAnimationFinished(event: AnimationEvent): void {
		if (event.toState === "closed") {
			const element = document.getElementById("sidebar");
			element.style.setProperty("display", "none", "important");
		}
	}

	/**
	 * Set the css display mode to block, e.g. visible before the open animation
	 * @param event Animation event
	 */
	setSidebarDisplay(event: AnimationEvent): void {
		const element = document.getElementById("sidebar");
		if (event.toState === "open") {
			element.style.setProperty("display", "block", "important");
		}
	}
}
