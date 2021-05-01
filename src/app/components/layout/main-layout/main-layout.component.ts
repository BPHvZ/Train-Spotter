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

import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { MetaTagService } from "../../../services/meta-tag.service";
import { SharedDataService } from "../../../services/shared-data.service";

/**
 * Main layout of the application
 */
@Component({
	selector: "app-main-layout",
	templateUrl: "./main-layout.component.html",
	styleUrls: ["./main-layout.component.sass"],
})
export class MainLayoutComponent implements OnDestroy {
	/**True if the current page is the train map*/
	isTrainMap = false;
	/**Window inner height*/
	innerHeight = window.innerHeight;
	/**All observable subscriptions*/
	subscriptions: Subscription[] = [];

	/**
	 * Subscribe to the current route
	 * @param router Router object
	 * @param sharedDataService
	 */
	constructor(
		private router: Router,
		private sharedDataService: SharedDataService,
		private metaTagsService: MetaTagService
	) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const sub1 = router.events.subscribe((_) => {
			// if on train map remove padding
			this.isTrainMap = router.url.endsWith("kaart");
		});

		const sub2 = sharedDataService.innerHeight$.subscribe((height) => {
			this.innerHeight = height;
		});
		this.subscriptions.push(sub1, sub2);
	}

	/** Unsubscribe from observables on destroy */
	ngOnDestroy(): void {
		this.subscriptions.forEach((subscription) => subscription.unsubscribe());
	}

	onRouterOutletActivate(component: Component): void {
		this.metaTagsService.updateTags(component["componentName"]);
	}
}
