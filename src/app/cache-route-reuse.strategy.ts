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

@Injectable()
export class CacheRouteReuseStrategy implements RouteReuseStrategy {
	storedRouteHandles = new Map<string, DetachedRouteHandle>();
	allowRetriveCache = {
		kaart: true,
	};

	private static getPath(route: ActivatedRouteSnapshot): string {
		if (route.routeConfig !== null && route.routeConfig.path !== null) {
			return route.routeConfig.path;
		}
		return "";
	}

	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		this.allowRetriveCache.kaart =
			CacheRouteReuseStrategy.getPath(curr) === "stations" && CacheRouteReuseStrategy.getPath(future) === "kaart";
		return curr.routeConfig === future.routeConfig;
	}

	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
		return this.storedRouteHandles.get(CacheRouteReuseStrategy.getPath(route));
	}

	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		const path = CacheRouteReuseStrategy.getPath(route);
		if (this.allowRetriveCache[path]) {
			return this.storedRouteHandles.has(CacheRouteReuseStrategy.getPath(route));
		}
		return false;
	}

	shouldDetach(route: ActivatedRouteSnapshot): boolean {
		const path = CacheRouteReuseStrategy.getPath(route);
		return Object.prototype.hasOwnProperty.call(this.allowRetriveCache, path) as boolean;
	}

	store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
		this.storedRouteHandles.set(CacheRouteReuseStrategy.getPath(route), detachedTree);
	}
}
