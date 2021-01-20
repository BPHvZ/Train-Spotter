import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CacheService } from "./cache.service";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

export enum Verbs {
	GET = "GET",
	PUT = "PUT",
	POST = "POST",
	DELETE = "DELETE",
}

export class HttpOptions {
	url: string;
	body?: any;
	headers?: any;
	cacheMins?: number;
	params?: HttpParams;
}

@Injectable({
	providedIn: "root",
})
export class HttpClientService {
	constructor(private http: HttpClient, private cacheService: CacheService) {}

	get<T>(options: HttpOptions): Observable<T> {
		return this.httpCall(Verbs.GET, options);
	}

	delete<T>(options: HttpOptions): Observable<T> {
		return this.httpCall(Verbs.DELETE, options);
	}

	post<T>(options: HttpOptions): Observable<T> {
		return this.httpCall(Verbs.POST, options);
	}

	put<T>(options: HttpOptions): Observable<T> {
		return this.httpCall(Verbs.PUT, options);
	}

	private httpCall<T>(verb: Verbs, options: HttpOptions): Observable<T> {
		// Setup default values
		options.body = options.body || null;
		options.cacheMins = options.cacheMins || 0;
		options.headers = options.headers || {};
		const params = options.params?.toString() || null;
		options.url = "https://cors-bartvanzeist.herokuapp.com/" + options.url;

		if (options.cacheMins > 0) {
			// Get data from cache
			const data = this.cacheService.load(options.url, params);
			// Return data from cache
			if (data !== null) {
				console.log("from cache");
				return of<T>(data);
			}
		}

		return this.http
			.request<T>(verb, options.url, {
				body: options.body,
				headers: options.headers,
				params: options.params,
			})
			.pipe(
				switchMap((response) => {
					console.log("from url");
					if (options.cacheMins > 0) {
						// Data will be cached
						this.cacheService.save({
							key: options.url,
							params,
							data: response,
							expirationMins: options.cacheMins,
						});
					}
					return of<T>(response);
				})
			);
	}
}
