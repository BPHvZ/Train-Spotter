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

interface IRouteConfigData {
	reuse: boolean;
}

interface ICachedRoute {
	handle: DetachedRouteHandle;
	data: IRouteConfigData;
}

@Injectable()
export class TrainSpotterRouteReuseStrategy implements RouteReuseStrategy {
	private routeCache = new Map<string, ICachedRoute>();

	private static getRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
		return route.url.map((urlSegment) => urlSegment.path);
	}

	private static getRouteData(route: ActivatedRouteSnapshot): IRouteConfigData {
		return route.routeConfig && (route.routeConfig.data as IRouteConfigData);
	}

	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		const ret = future.routeConfig === curr.routeConfig;
		if (ret) {
			this.addRedirectsRecursively(future); // update redirects
		}
		return ret;
	}

	shouldDetach(route: ActivatedRouteSnapshot): boolean {
		const data = TrainSpotterRouteReuseStrategy.getRouteData(route);
		return data && data.reuse;
	}

	store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
		const url = this.getFullRouteUrl(route);
		const data = TrainSpotterRouteReuseStrategy.getRouteData(route);
		this.routeCache.set(url, {
			handle,
			data,
		});
		this.addRedirectsRecursively(route);
	}

	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		const url = this.getFullRouteUrl(route);
		return this.routeCache.has(url);
	}

	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
		const url = this.getFullRouteUrl(route);
		const data = TrainSpotterRouteReuseStrategy.getRouteData(route);
		return data && data.reuse && this.routeCache.has(url) ? this.routeCache.get(url).handle : null;
	}

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

	private getFullRouteUrl(route: ActivatedRouteSnapshot): string {
		return this.getFullRouteUrlPaths(route).filter(Boolean).join("/");
	}

	private getFullRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
		const paths = TrainSpotterRouteReuseStrategy.getRouteUrlPaths(route);
		return route.parent ? [...this.getFullRouteUrlPaths(route.parent), ...paths] : paths;
	}
}
