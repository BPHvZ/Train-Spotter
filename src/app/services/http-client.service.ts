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

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { CacheService } from "./cache.service";

/**
 * Network request methods
 */
export enum Verbs {
	GET = "GET",
	PUT = "PUT",
	POST = "POST",
	DELETE = "DELETE",
}

/**
 * Network request
 */
export interface HttpOptions {
	/**URL to visit*/
	url: string;
	/**Request body*/
	body?: any;
	/**Request headers*/
	headers?: HttpHeaders;
	/**How long to cache the response*/
	cacheMins?: number;
	/**URL parameters*/
	params?: HttpParams;
	/**Do not check cache and force the network request*/
	force?: boolean;
}

/**
 * Url or cache response
 * */
export enum ResponseType {
	URL = "URL",
	CACHE = "CACHE",
}

/**
 * Response object with {@link ResponseType}
 */
export interface Response<T> {
	/**Data object*/
	data: T;
	/**Response type*/
	responseType: ResponseType;
}

/**
 * Make Http requests
 */
@Injectable({
	providedIn: "root",
})
export class HttpClientService {
	/**
	 * Defines services
	 * @param http Makes http requests
	 * @param cacheService Get and save data to cache
	 */
	constructor(private http: HttpClient, private cacheService: CacheService) {}

	/**
	 * Make a GET request
	 * @param options Http request object
	 * @returns Response of type {@link T}
	 */
	get<T>(options: HttpOptions): Observable<Response<T>> {
		return this.httpCall<T>(Verbs.GET, options);
	}

	/**
	 * Make a DELETE request
	 * @param options Http request object
	 * @returns Response of type {@link T}
	 */
	delete<T>(options: HttpOptions): Observable<Response<T>> {
		return this.httpCall(Verbs.DELETE, options);
	}

	/**
	 * Make a POST request
	 * @param options Http request object
	 * @returns Response of type {@link T}
	 */
	post<T>(options: HttpOptions): Observable<Response<T>> {
		return this.httpCall(Verbs.POST, options);
	}

	/**
	 * Make a PUT request
	 * @param options Http request object
	 * @returns Response of type {@link T}
	 */
	put<T>(options: HttpOptions): Observable<Response<T>> {
		return this.httpCall(Verbs.PUT, options);
	}

	/**
	 * Make a network request
	 * Check cache if specified and return cached object
	 * @param verb Request method
	 * @param options Http request object
	 * @returns Response of type {@link T}
	 */
	private httpCall<T>(verb: Verbs, options: HttpOptions): Observable<Response<T>> {
		// Setup default values
		options.body = options.body || null;
		options.cacheMins = options.cacheMins || 0;
		options.headers = options.headers || new HttpHeaders();
		const params = options.params?.toString() || null;
		options.url = "https://cors-bartvanzeist.herokuapp.com/" + options.url;
		options.force = options.force || false;

		options.headers.set("Accept-Encoding", ["gzip", "deflate", "br"]);

		if (options.cacheMins > 0 && options.force == false) {
			// Get data from cache
			const data = this.cacheService.load(options.url, params);
			// Return data from cache
			if (data !== null) {
				console.log("from cache");
				return of<Response<T>>({
					data: data,
					responseType: ResponseType.CACHE,
				});
			}
		}

		return this.http
			.request<T>(verb, options.url, {
				body: options.body,
				headers: options.headers,
				params: options.params,
			})
			.pipe(
				map((response) => {
					console.log("from url");
					// Data will be cached
					if (options.cacheMins > 0) {
						this.cacheService.save({
							key: options.url,
							params,
							data: response,
							expirationMins: options.cacheMins,
						});
					}
					return {
						data: response,
						responseType: ResponseType.URL,
					};
				})
			);
	}
}
