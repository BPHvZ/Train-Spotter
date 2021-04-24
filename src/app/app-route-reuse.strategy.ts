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
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";

/** Config of a route */
interface IRouteConfigData {
	/** Reuse the route or not */
	reuse: boolean;
}

/** Cache a route */
interface ICachedRoute {
	/** Detached route tree */
	handle: DetachedRouteHandle;
	/** Route reuse config */
	data: IRouteConfigData;
}

/** Cache and reuse the route */
@Injectable()
export class TrainSpotterRouteReuseStrategy implements RouteReuseStrategy {
	/** store routes and their reuse config */
	private routeCache = new Map<string, ICachedRoute>();

	/**
	 * Get the path from the URL
	 * @param route Current route snapshot
	 * @return string[] Segments of the URL
	 */
	private static getRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
		return route.url.map((urlSegment) => urlSegment.path);
	}

	/**
	 * Get the reuse config
	 * @param route Current route snapshot
	 * @return IRouteConfigData Reuse config
	 */
	private static getRouteData(route: ActivatedRouteSnapshot): IRouteConfigData {
		return route.routeConfig && (route.routeConfig.data as IRouteConfigData);
	}

	/**
	 * Determine to reuse the route or not
	 * @param future Route to navigate to
	 * @param curr Current route
	 * @return boolean Reuse the route or not
	 */
	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		const ret = future.routeConfig === curr.routeConfig;
		if (ret) {
			this.addRedirectsRecursively(future); // update redirects
		}
		return ret;
	}

	/**
	 * Detach if not needed to reuse
	 * @param route Current route snapshot
	 * @return boolean Detach the route or not
	 */
	shouldDetach(route: ActivatedRouteSnapshot): boolean {
		const data = TrainSpotterRouteReuseStrategy.getRouteData(route);
		return data && data.reuse;
	}

	/**
	 * Store the route to reuse it
	 * @param route Current route snapshot
	 * @param handle The detached route tree
	 */
	store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
		const url = this.getFullRouteUrl(route);
		const data = TrainSpotterRouteReuseStrategy.getRouteData(route);
		this.routeCache.set(url, {
			handle,
			data,
		});
		this.addRedirectsRecursively(route);
	}

	/**
	 * Attach if needed to reuse
	 * @param route Current route snapshot
	 * @return boolean Whether the to attach if not already doing so
	 */
	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		const url = this.getFullRouteUrl(route);
		return this.routeCache.has(url);
	}

	/**
	 * Retrieve the route
	 * @param route Current route snapshot
	 * @return DetachedRouteHandle The detached route tree
	 */
	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
		const url = this.getFullRouteUrl(route);
		const data = TrainSpotterRouteReuseStrategy.getRouteData(route);
		return data && data.reuse && this.routeCache.has(url) ? this.routeCache.get(url).handle : null;
	}

	/**
	 * Update redirects
	 * @param route Current route snapshot
	 */
	private addRedirectsRecursively(route: ActivatedRouteSnapshot): void {
		const config = route.routeConfig;
		if (config) {
			if (!config.loadChildren) {
				const routeFirstChild = route.firstChild;
				const routeFirstChildUrl = routeFirstChild
					? TrainSpotterRouteReuseStrategy.getRouteUrlPaths(routeFirstChild).join("/")
					: "";
				const childConfigs = config.children;
				if (childConfigs) {
					const childConfigWithRedirect = childConfigs.find((c) => c.path === "" && !!c.redirectTo);
					if (childConfigWithRedirect) {
						childConfigWithRedirect.redirectTo = routeFirstChildUrl;
					}
				}
			}
			route.children.forEach((childRoute) => this.addRedirectsRecursively(childRoute));
		}
	}

	/**
	 * Get the full router url from paths
	 * @param route Current route snapshot
	 * @return string Full router url
	 */
	private getFullRouteUrl(route: ActivatedRouteSnapshot): string {
		return this.getFullRouteUrlPaths(route).filter(Boolean).join("/");
	}

	/**
	 * Get route paths
	 * @param route Current route snapshot
	 * @return string[] route paths
	 */
	private getFullRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
		const paths = TrainSpotterRouteReuseStrategy.getRouteUrlPaths(route);
		return route.parent ? [...this.getFullRouteUrlPaths(route.parent), ...paths] : paths;
	}
}
