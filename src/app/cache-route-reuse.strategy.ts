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

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, DetachedRouteHandle } from "@angular/router";
import { RouteReuseStrategy } from "@angular/router/";

/**
 * Reuse certain pages to prevent reloading it after navigating between pages
 */
@Injectable()
export class CacheRouteReuseStrategy implements RouteReuseStrategy {
	/**Store route handles*/
	storedRouteHandles = new Map<string, DetachedRouteHandle>();
	/**Pages allowed to be reused*/
	allowRetrieveCache = {
		kaart: true,
	};

	/**
	 * Get path name of route snapshot
	 * @param route Route snapshot
	 * @returns string Path name
	 */
	private static getPath(route: ActivatedRouteSnapshot): string {
		if (route.routeConfig !== null && route.routeConfig.path !== null) {
			return route.routeConfig.path;
		}
		return "";
	}

	/**
	 * Determine to reuse the page or not
	 * @param curr Route navigating from
	 * @param future Route navigating to
	 * @returns boolean Reuse page or not
	 */
	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		this.allowRetrieveCache.kaart =
			CacheRouteReuseStrategy.getPath(curr) === "stations" && CacheRouteReuseStrategy.getPath(future) === "kaart";
		return curr.routeConfig === future.routeConfig;
	}

	/**
	 * Retrieve cached page
	 * @param route Route snapshot
	 * @returns DetachedRouteHandle | null Cached page or null
	 */
	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
		return this.storedRouteHandles.get(CacheRouteReuseStrategy.getPath(route));
	}

	/**
	 * Should attach to page or not
	 * @param route Route snapshot
	 * @returns boolean True when route is in {@link allowRetrieveCache}
	 */
	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		const path = CacheRouteReuseStrategy.getPath(route);
		if (this.allowRetrieveCache[path]) {
			return this.storedRouteHandles.has(CacheRouteReuseStrategy.getPath(route));
		}
		return false;
	}

	/**
	 * Should detach from page or not
	 * @param route Route snapshot
	 * @returns boolean True when route is in {@link allowRetrieveCache}
	 */
	shouldDetach(route: ActivatedRouteSnapshot): boolean {
		const path = CacheRouteReuseStrategy.getPath(route);
		return Object.prototype.hasOwnProperty.call(this.allowRetrieveCache, path) as boolean;
	}

	/**
	 * Cache page
	 * @param route Route snapshot
	 * @param detachedTree Page objects
	 */
	store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
		this.storedRouteHandles.set(CacheRouteReuseStrategy.getPath(route), detachedTree);
	}
}
