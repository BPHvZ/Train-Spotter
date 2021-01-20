import { Component, EventEmitter, Input, Output } from "@angular/core";
import { trigger, state, style, animate, transition, animateChild, query, group } from "@angular/animations";
import { DisruptionPayload } from "../../models/Disruption";
import { AnimationEvent } from "@angular/animations";

@Component({
	selector: "app-train-map-sidebar",
	templateUrl: "./train-map-sidebar.component.html",
	styleUrls: ["./train-map-sidebar.component.sass"],
	animations: [
		trigger("openClose", [
			state(
				"open",
				style({
					transform: "scaleX(1)",
				})
			),
			state(
				"closed",
				style({
					transform: "scaleX(0)",
				})
			),
			transition("open => closed", [
				group([
					// query('@openClose-content', animateChild()),
					animate("0.5s cubic-bezier(0.55, 0.31, 0.15, 0.93)"),
				]),
			]),
			transition("* => open", [
				group([
					// query('@openClose-content', animateChild()),
					animate("0.5s cubic-bezier(0.55, 0.31, 0.15, 0.93)"),
				]),
			]),
		]),
		trigger("openClose-content", [
			state(
				"open",
				style({
					opacity: 1,
				})
			),
			state(
				"closed",
				style({
					opacity: 0,
				})
			),
			transition("open => closed", [animate("0.3s cubic-bezier(0.55, 0.31, 0.15, 0.93)")]),
			transition("* => open", [animate("0.7s cubic-bezier(0.55, 0.31, 0.15, 0.93)")]),
		]),
		trigger("openClose-arrow", [
			state(
				"open",
				style({
					"margin-right": "100%",
				})
			),
			state(
				"closed",
				style({
					"margin-right": "0%",
				})
			),
			transition("open => closed", [
				group([query("@rotatedState", animateChild()), animate("0.5s cubic-bezier(0.55, 0.31, 0.15, 0.93)")]),
			]),
			transition("* => open", [
				group([query("@rotatedState", animateChild()), animate("0.5s cubic-bezier(0.55, 0.31, 0.15, 0.93)")]),
			]),
		]),
		trigger("rotatedState", [
			state("closed", style({ transform: "rotate(90deg)" })),
			state("open", style({ transform: "rotate(-90deg)" })),
			transition("open => closed", [animate("0.5s cubic-bezier(0.55, 0.31, 0.15, 0.93)")]),
			transition("closed => open", [animate("0.5s cubic-bezier(0.55, 0.31, 0.15, 0.93)")]),
		]),
	],
})
export class TrainMapSidebarComponent {
	@Input() disruptions: DisruptionPayload[];
	@Output() closeSidebar = new EventEmitter();
	@Output() flyToDisruption = new EventEmitter<DisruptionPayload>();
	@Output() clickOnArrow = new EventEmitter<boolean>();
	sidebarState = "closed";

	changeState(): void {
		this.sidebarState = this.sidebarState === "closed" ? "open" : "closed";
	}

	done(event: AnimationEvent): void {
		if (event.toState === "closed") {
			this.closeSidebar.emit(null);
		}
	}

	/**
	 * Change view to the train map and fly to a disruption
	 * @param disruption Fly to this disruption
	 */
	flyToDisruptionOnMap(disruption: DisruptionPayload): void {
		this.flyToDisruption.emit(disruption);
	}
}
