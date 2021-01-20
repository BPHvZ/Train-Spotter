import { RouteReuseStrategy } from "@angular/router/";
import { ActivatedRouteSnapshot, DetachedRouteHandle } from "@angular/router";
import { Injectable } from "@angular/core";

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
