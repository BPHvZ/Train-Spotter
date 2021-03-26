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
import { Component, EventEmitter, Input, Output, Renderer2, RendererStyleFlags2 } from "@angular/core";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { MarkerComponent } from "ngx-mapbox-gl/lib/marker/marker.component";
import { Observable } from "rxjs";
import { DisruptionBase, DisruptionsList } from "../../models/ReisinformatieAPI";
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

	/**Sidebar open/closed state*/
	sidebarState$: Observable<"open" | "closed"> = this.sharedDataService.sidebarState$;
	/**FontAwesome sync icon*/
	faSyncAlt = faSyncAlt;

	/**Date when disruptions have been last updated*/
	disruptionsLastUpdated$: Observable<Date> = this.sharedDataService.disruptionsLastUpdated$;

	private _focusedDisruptionMarker: MarkerComponent = null;

	/**
	 * Define services
	 * @param sharedDataService Shares data through the application
	 * @param renderer Used to modify DOM elements
	 */
	constructor(private sharedDataService: SharedDataService, private renderer: Renderer2) {}

	getDisruptionCount(type: "CALAMITY" | "DISRUPTION" | "MAINTENANCE"): number {
		const disruptions = this.activeDisruptions.filter((c) => c.type === type);
		return disruptions.length;
	}

	/**
	 * Is run when the sidebar animation has finished
	 * Sets the css display mode to none to not occupy space on the train map
	 * NOTE: without this, the area of the open sidebar can not be interacted with
	 * @param event Animation event
	 */
	sidebarAnimationFinished(event: AnimationEvent): void {
		const sidebarComponent = document.getElementById("sidebar-component");
		const sidebarWrapper = document.getElementById("sidebar-wrapper");
		const sidebarContainer = document.getElementById("sidebar-container");
		const sidebar = document.getElementById("sidebar");

		this.renderer.setStyle(sidebarContainer, "willChange", "auto");
		if (event.toState === "closed") {
			this.renderer.setStyle(sidebarWrapper, "position", "absolute");
			this.renderer.setStyle(sidebarWrapper, "right", "0");
			this.renderer.setStyle(sidebarWrapper, "height", "unset");
			this.renderer.setStyle(sidebarWrapper, "top", "calc(50% - (135px / 2))");
			this.renderer.setStyle(sidebarWrapper, "padding", "30px 0 30px 30px");
			this.renderer.setStyle(sidebar, "display", "none", RendererStyleFlags2.Important);

			// FIX - redraws sidebar in safari. Otherwise still occupies the sidebar area and no interaction is available
			const display = sidebarComponent.style.display;
			this.renderer.setStyle(sidebarComponent, "display", "none");
			console.log(sidebarComponent.offsetHeight);
			this.renderer.setStyle(sidebarComponent, "display", display);
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

		this.renderer.setStyle(sidebarWrapper, "position", "relative");
		this.renderer.setStyle(sidebarWrapper, "right", "unset");
		this.renderer.setStyle(sidebarWrapper, "height", "100%");
		this.renderer.setStyle(sidebarWrapper, "top", "unset");
		this.renderer.setStyle(sidebarWrapper, "padding", "0 0 0 30px");
		this.renderer.setStyle(sidebarContainer, "willChange", "contents");

		if (event.toState === "open") {
			this.renderer.setStyle(sidebar, "display", "block", RendererStyleFlags2.Important);
		}
	}

	/**
	 * Open or close the sidebar
	 */
	toggleSidebar(): void {
		this.sharedDataService.toggleSidebar();
	}

	/**
	 * Fly to a disruption on the map
	 * Close the sidebar on small screens
	 * @param disruption Disruption to fly to
	 */
	flyToDisruption(disruption: DisruptionBase): void {
		if (this.sharedDataService.screenWidth <= 767) {
			this.toggleSidebar();
		}
		this.sharedDataService.flyToDisruption(disruption);
	}

	onMouseEnterDisruptionCard(event: MouseEvent, disruption: DisruptionBase): void {
		// find disruption on map and hover
		event.preventDefault();
		const markers = Array.from(this.sharedDataService.disruptionMarkerElements);
		const marker = markers.find((m) => m.feature.properties.id == disruption.id);
		if (marker) {
			this._focusedDisruptionMarker = marker;
			const markerElement = marker.content.nativeElement as HTMLElement;
			const markerChild = markerElement.firstChild.firstChild as HTMLElement;
			this.renderer.setStyle(markerElement, "zIndex", "1");
			markerChild.focus();
		}
		event.preventDefault();
	}

	onMouseLeaveDisruptionCard(event: MouseEvent, disruption: DisruptionBase): void {
		// find disruption on map and hover
		event.preventDefault();
		let marker = this._focusedDisruptionMarker;
		if (marker === null) {
			const markers = Array.from(this.sharedDataService.disruptionMarkerElements);
			marker = markers.find((m) => m.feature.properties.id == disruption.id);
		}
		if (marker) {
			const markerElement = marker.content.nativeElement as HTMLElement;
			const markerChild = markerElement.firstChild.firstChild as HTMLElement;
			markerChild.blur();
			this.renderer.setStyle(markerElement, "zIndex", "unset");
		}
		event.preventDefault();
	}
}
