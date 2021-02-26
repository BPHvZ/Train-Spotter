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

/**
 * Cache netwerk responses in LocalStorage
 */
@Injectable({
	providedIn: "root",
})
export class CacheService {
	/**
	 * Save data in localstorage
	 * expirationMins specifies the caching time
	 * @param options Data and parameters to store
	 */
	save(options: LocalStorageSaveOptions): void {
		// Set default values for optionals
		options.expirationMins = options.expirationMins || 0;

		// Set expiration date in miliseconds
		const expirationMS = options.expirationMins !== 0 ? options.expirationMins * 60 * 1000 : 0;

		const record: CacheRecord = {
			value: typeof options.data === "string" ? options.data : JSON.stringify(options.data),
			params: options.params,
			expiration: expirationMS !== 0 ? new Date().getTime() + expirationMS : null,
			hasExpiration: expirationMS !== 0,
		};
		localStorage.setItem(options.key, JSON.stringify(record));
	}

	/**
	 * Load data from localstorage
	 * @param key Unique key used to store the data
	 * @param params Parameters used in the network request that could differ from the stored request
	 * @returns The value of the stored data or null if the key is not found
	 */
	load(key: string, params?: string): any {
		// Get cached data from localstorage
		const item = localStorage.getItem(key);
		if (item !== null) {
			const record = JSON.parse(item) as CacheRecord;
			const now = new Date().getTime();
			// Expired data will return null
			if (!record || (record.hasExpiration && record.expiration <= now)) {
				this.remove(key);
				return null;
			} else if (record.params !== params) {
				return null;
			} else {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return JSON.parse(record.value);
			}
		}
		return null;
	}

	/**
	 * Remove data from localstorage by key
	 * @param key Remove data stored in localstorage by this key
	 */
	remove(key: string): void {
		localStorage.removeItem(key);
	}

	/**
	 * Empty all stored data in localstorage
	 */
	cleanLocalStorage(): void {
		localStorage.clear();
	}
}

/**
 * Data and parameters used to specify the caching time and network request that is being stored
 */
export class LocalStorageSaveOptions {
	/**Unique key for localstorage to store the data by*/
	key: string;
	/**Parameters used in the network request. Used to compare request to the same endpoint but with different parameters*/
	params?: string;
	/**Object to store*/
	data: any;
	/**Caching time in minutes*/
	expirationMins?: number;
}

/**
 * Object that is stored in localstorage. Can be specified with caching options
 */
export interface CacheRecord {
	/**JSON being stored*/
	value: string;
	/**Parameters used in the network request*/
	params: string;
	/**How long to keep the data in cache the data*/
	expiration?: number;
	/**Uses caching or not*/
	hasExpiration: boolean;
}
