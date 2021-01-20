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
}
