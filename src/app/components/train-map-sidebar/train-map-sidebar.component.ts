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
					transform: "translate(calc(100% - 30px))",
				})
			),
			transition(
				"open <=> closed",
				group([
					query("@sidebar-shadow", animateChild()),
					query("@rotatedState", animateChild()),
					animate("0.5s cubic-bezier(0.55, 0.31, 0.15, 0.93)"),
				])
			),
		]),
		trigger("sidebar-shadow", [
			state(
				"open",
				style({
					boxShadow: "-15px 0 1rem -2px rgba(0, 0, 0, 0.15)",
				})
			),
			state(
				"closed",
				style({
					boxShadow: "0 0 0 0 rgba(0, 0, 0, 0.15)",
				})
			),
			transition("open <=> closed", animate("0.5s cubic-bezier(0.55, 0.31, 0.15, 0.93)")),
		]),
		trigger("rotatedState", [
			state("closed", style({ transform: "rotate(90deg)" })),
			state("open", style({ transform: "rotate(-90deg)" })),
			transition("open <=> closed", animate("0.5s cubic-bezier(0.55, 0.31, 0.15, 0.93)")),
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
		const sidebarWrapper = document.getElementById("sidebar-wrapper");
		const sidebarContainer = document.getElementById("sidebar-container");
		const sidebar = document.getElementById("sidebar");
		sidebarContainer.style.willChange = "auto";
		if (event.toState === "closed") {
			sidebarWrapper.style.position = "absolute";
			sidebarWrapper.style.right = "0";
			sidebarWrapper.style.height = "unset";
			sidebarWrapper.style.top = "calc(50% - (135px / 2))";
			sidebarWrapper.style.padding = "30px 0 30px 30px";
			sidebar.style.setProperty("display", "none", "important");
		}
	}

	/**
	 * Set the css display mode to block, e.g. visible before the open animation
	 * @param event Animation event
	 */
	sidebarAnimationStarted(event: AnimationEvent): void {
		const sidebarWrapper = document.getElementById("sidebar-wrapper");
		const sidebarContainer = document.getElementById("sidebar-container");
		const sidebar = document.getElementById("sidebar");
		sidebarWrapper.style.position = "relative";
		sidebarWrapper.style.right = "unset";
		sidebarWrapper.style.height = "100%";
		sidebarWrapper.style.top = "unset";
		sidebarWrapper.style.padding = "0 0 0 30px";

		sidebarContainer.style.willChange = "contents";
		if (event.toState === "open") {
			sidebar.style.setProperty("display", "block", "important");
		}
	}
}
