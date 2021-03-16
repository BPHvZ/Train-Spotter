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
	/**True if the current page is the train map*/
	isTrainMap = false;

	deferredPrompt: any;
	showButton = false;
	doNotShowInstallAgain = false;

	/**
	 * Subscribe to the current route
	 * @param router Router object
	 */
	constructor(private router: Router) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		router.events.subscribe((_) => {
			// if on train map remove padding
			this.isTrainMap = router.url.endsWith("kaart");
		});
		window.addEventListener("beforeinstallprompt", (event: any) => {
			// eslint-disable-next-line
			event.preventDefault();
			this.deferredPrompt = event;
			this.showButton = true;
		});

		window.addEventListener("appinstalled", () => {
			// Hide the app-provided install promotion
			this.showButton = false;
			// Clear the deferredPrompt so it can be garbage collected
			this.deferredPrompt = null;
			// Optionally, send analytics event to indicate successful install
			console.log("PWA was installed");
		});
	}

	installPWA(): void {
		// hide our user interface that shows our A2HS button
		this.showButton = false;
		// Show the prompt
		// eslint-disable-next-line
		this.deferredPrompt.prompt();
		// Wait for the user to respond to the prompt
		// eslint-disable-next-line
		this.deferredPrompt.userChoice.then((choiceResult) => {
			// eslint-disable-next-line
			if (choiceResult.outcome === "accepted") {
				console.log("User accepted the A2HS prompt");
			} else {
				console.log("User dismissed the A2HS prompt");
			}
			this.deferredPrompt = null;
		});
	}

	closeInstallPWAAlert(): void {
		this.showButton = false;
	}
}
