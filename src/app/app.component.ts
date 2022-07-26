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
import { AfterViewInit, Component, OnDestroy, TemplateRef, ViewChild } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import { faArrowAltCircleUp } from "@fortawesome/free-regular-svg-icons";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { Subscription } from "rxjs";
import { ToastPosition, ToastService } from "./services/toast.service";

/**
 * TrainSpotter starting point
 */
@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.sass"],
})
export class AppComponent implements OnDestroy, AfterViewInit {
	/**New version toast template*/
	@ViewChild("NewVersionAvailableTpl") newVersionAvailableRef: TemplateRef<any>;
	/**Redo icon*/
	faRedo = faRedo;
	/**Refresh icon*/
	faArrowAltCircleUp = faArrowAltCircleUp;

	/**All observable subscriptions*/
	subscriptions: Subscription[] = [];

	/**
	 * Define services
	 * Refresh the page when a new version of TrainSpotter is available
	 * @param updates Service Worker service
	 * @param toastService Show or delete toast notifications
	 */
	constructor(private updates: SwUpdate, private toastService: ToastService) {
		const sub2 = updates.unrecoverable.subscribe((event) => {
			document.location.reload();
		});
		this.subscriptions.push(sub2);
	}

	/**
	 * After DOM is loaded, check for updates
	 */
	ngAfterViewInit() {
		const sub1 = this.updates.available.subscribe(() => {
			console.log("update available");
			const toast = {
				textOrTpl: this.newVersionAvailableRef,
				position: ToastPosition.Center,
				classname: "",
				delay: 5000,
				autoHide: false,
			};
			this.toastService.show(toast);
			setTimeout(() => {
				this.activateUpdateAndReload();
			}, 5000);
		});
		this.subscriptions.push(sub1);
	}

	/**
	 * Activate update and reload page
	 */
	activateUpdateAndReload(): void {
		this.updates.activateUpdate().then(() => document.location.reload());
	}

	/** Unsubscribe from observables on destroy */
	ngOnDestroy() {
		this.subscriptions.forEach((subscription) => subscription.unsubscribe());
	}
}
