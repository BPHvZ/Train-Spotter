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
	AfterViewInit,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	Renderer2,
	TemplateRef,
	ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { faArrowAltCircleDown, faBars, faCrosshairs, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { NgbModal, NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { Observable, of, Subscription } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from "rxjs/operators";
import { GlobalSearchResult, GlobalSearchResultType } from "../../../models/GlobalSearch";
import { Station } from "../../../models/ReisinformatieAPI";
import { DetailedTrainInformation } from "../../../models/VirtualTrainAPI";
import { CacheService } from "../../../services/cache.service";
import { GlobalSearchService } from "../../../services/global-search.service";
import { SharedDataService } from "../../../services/shared-data.service";

/**
 * Header that is visible on all pages
 */
@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.sass"],
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
	/**The global search input field*/
	@ViewChild("globalTypeahead") globalTypeahead: ElementRef;

	/**
	 * Status of the collapsable navbar
	 * Note: only used on smaller screens
	 */
	navbarCollapsed = true;

	/**FontAwesome crosshair icon*/
	faCrosshairs = faCrosshairs;
	/**FontAwesome bars icon*/
	faBars = faBars;
	/**FontAwesome arrow down circle icon*/
	faArrowAltCircleDown = faArrowAltCircleDown;
	faInfoCircle = faInfoCircle;

	/**Status of global search*/
	searchingGlobally = false;
	/**Status of failure during global search*/
	searchGloballyFailed = false;

	/**Global search is ready when data is loaded*/
	globalSearchReady = false;
	/**Check if data has been loaded*/
	globalSearchReadySubscription: Subscription;

	/**Browser PWA install prompt*/
	deferredPrompt: any;
	/**Show the PWA install button when browser is ready*/
	showPWAInstallButton = false;
	/**Whether to show the install button or remove it from header*/
	doNotShowInstallAgainCheckbox = false;

	/**All observable subscriptions*/
	subscriptions: Subscription[] = [];

	/**
	 * Define services
	 * @param sharedDataService Shares data through the application
	 * @param globalSearchService Searches on stations and trains
	 * @param cacheService Cache object
	 * @param modalService Open/close NgbModal
	 * @param renderer Used to modify DOM elements
	 * @param router Router object
	 */
	constructor(
		private sharedDataService: SharedDataService,
		private globalSearchService: GlobalSearchService,
		private cacheService: CacheService,
		private modalService: NgbModal,
		private renderer: Renderer2,
		private router: Router
	) {
		const cachedShowPWAInstall: boolean = cacheService.load("showPWAInstall") ?? true;
		if (cachedShowPWAInstall == false) {
			this.showPWAInstallButton = false;
		}

		this.globalSearchReadySubscription = this.sharedDataService.globalSearchReady$.subscribe(
			([stations, trains]) => {
				if (stations != null && trains != null) {
					this.globalSearchReady = true;
					this.globalSearchReadySubscription.unsubscribe();
				}
			}
		);

		/* eslint-disable */
		window.addEventListener("beforeinstallprompt", (event: any) => {
			if (!window.matchMedia("(display-mode: standalone)").matches || cachedShowPWAInstall == true) {
				if ("getInstalledRelatedApps" in navigator) {
					event.preventDefault(); // Stop automated install prompt.
					// @ts-ignore
					navigator.getInstalledRelatedApps().then((relatedApps) => {
						if (relatedApps.length == 0) {
							this.deferredPrompt = event;
							this.showPWAInstallButton = true;
						}
					});
				} else {
					event.preventDefault();
					this.deferredPrompt = event;
					this.showPWAInstallButton = true;
				}
			}
		});
		/* eslint-enable */

		window.addEventListener("appinstalled", () => {
			// Hide the app-provided install promotion
			this.showPWAInstallButton = false;
			// Clear the deferredPrompt so it can be garbage collected
			this.deferredPrompt = null;
			// Optionally, send analytics event to indicate successful install
			console.log("PWA was installed");
		});
	}

	/**Subscribe to navbar collapse changes*/
	ngOnInit(): void {
		const sub1 = this.sharedDataService.navbarCollapsed$.subscribe((value) => {
			this.navbarCollapsed = value;
		});
		this.subscriptions.push(sub1);
	}

	/** Unsubscribe from observables on destroy */
	ngOnDestroy(): void {
		this.subscriptions.forEach((subscription) => subscription.unsubscribe());
	}

	/** Lighthouse Aria improvement */
	ngAfterViewInit(): void {
		if (this.globalTypeahead !== undefined) {
			this.renderer.removeAttribute(this.globalTypeahead.nativeElement, "aria-multiline");
		}
	}

	/**
	 * Open the PWA install modal
	 * @param content Contant to show in the modal
	 */
	openPWAInstallModal(content: TemplateRef<any>): void {
		this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", centered: true });
	}

	/* eslint-disable */
	/**
	 * Install the PWA
	 * @param modal Modal to close
	 */
	installPWA(modal: any): void {
		modal.close();
		this.toggleNavbar();
		// Show the prompt
		this.deferredPrompt.prompt();
		// Wait for the user to respond to the prompt
		this.deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === "accepted") {
				this.showPWAInstallButton = false;
				console.log("User accepted TrainSpotter installation");
			} else {
				console.log("User dismissed TrainSpotter installation");
			}
			this.deferredPrompt = null;
		});
	}
	/* eslint-enable */

	/* eslint-disable */
	/**
	 * Close the PWA install modal
	 * @param modal Modal to close
	 */
	closePWAInstallModal(modal: any): void {
		if (this.doNotShowInstallAgainCheckbox) {
			this.hidePWAInstall();
		}
		modal.close();
	}
	/* eslint-enable */

	/**Hide the PWA install button from the header*/
	hidePWAInstall(): void {
		this.cacheService.save({
			data: false,
			key: "showPWAInstall",
		});
		this.showPWAInstallButton = false;
	}

	/**Collapse or expand the navbar*/
	toggleNavbar(): void {
		this.sharedDataService.toggleNavbar();
	}

	/**
	 * Full text search on stations and trains
	 * @param text$ Input text
	 * @returns Observable<GlobalSearchResult[]> An Observable of search results
	 */
	searchGlobally = (text$: Observable<string>): Observable<GlobalSearchResult[]> =>
		text$.pipe(
			debounceTime(600),
			distinctUntilChanged(),
			tap(() => (this.searchingGlobally = true)),
			switchMap(
				(term: string): Observable<GlobalSearchResult[]> =>
					this.globalSearchService.globalSearch(term).pipe(
						tap(() => (this.searchGloballyFailed = false)),
						catchError(() => {
							this.searchGloballyFailed = true;
							return of([]);
						})
					)
			),
			tap(() => (this.searchingGlobally = false))
		);

	/**
	 * Actions when an search result item is selected
	 * @param event The selected item
	 */
	selectItemFromGlobalSearch(event: NgbTypeaheadSelectItemEvent): void {
		const result = event.item as GlobalSearchResult;
		// event.preventDefault();
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		this.renderer.setValue(this.globalTypeahead.nativeElement, result.searchField);
		switch (result.resultType) {
			case GlobalSearchResultType.Train: {
				this.sharedDataService.flyToTrain(result.result as DetailedTrainInformation);
				break;
			}
			case GlobalSearchResultType.Station: {
				this.sharedDataService.flyToStation(result.result as Station);
				break;
			}
		}
		this.toggleNavbar();
	}

	/**
	 * Fly to a train on the map
	 * @param train The train to fly to
	 */
	flyToTrainOnMap(event: Event, train: DetailedTrainInformation): void {
		event.stopImmediatePropagation();
		this.sharedDataService.flyToTrain(train);
	}

	/**
	 * Fly to a station on the map
	 * @param station The station to fly to
	 */
	flyToStationOnMap(event: Event, station: Station): void {
		this.sharedDataService.flyToStation(station);
	}

	/** Navigate to the train information page*/
	navigateToRideInformation(event: Event, train: DetailedTrainInformation): void {
		event.stopImmediatePropagation();
		void this.router.navigate(["/rit", train.ritId]);
	}
}
