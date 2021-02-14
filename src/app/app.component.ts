/* eslint-disable */
import { Component } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.sass"],
})
export class AppComponent {
	title = "trainSpotter";

	constructor(private updates: SwUpdate) {
		updates.available.subscribe(() => {
			console.log("updated");
			updates.activateUpdate().then(() => document.location.reload());
		});
	}
}
