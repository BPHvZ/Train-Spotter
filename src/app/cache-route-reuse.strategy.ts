import { RouteReuseStrategy } from '@angular/router/';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CacheRouteReuseStrategy implements RouteReuseStrategy {
  storedRouteHandles = new Map<string, DetachedRouteHandle>();
  allowRetriveCache = {
    kaart: true
  };

  private static getPath(route: ActivatedRouteSnapshot): string {
    if (route.routeConfig !== null && route.routeConfig.path !== null) {
      return route.routeConfig.path;
    }
    return '';
  }
  shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    this.allowRetriveCache.kaart = CacheRouteReuseStrategy.getPath(before) === 'stations' && CacheRouteReuseStrategy.getPath(curr) === 'kaart';
    return before.routeConfig === curr.routeConfig;
  }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.storedRouteHandles.get(CacheRouteReuseStrategy.getPath(route)) as DetachedRouteHandle;
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
    return this.allowRetriveCache.hasOwnProperty(path);
  }
  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    this.storedRouteHandles.set(CacheRouteReuseStrategy.getPath(route), detachedTree);
  }
}