import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class CacheService {
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

	load(key: string, params: string): any {
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

	remove(key: string): void {
		localStorage.removeItem(key);
	}

	cleanLocalStorage(): void {
		localStorage.clear();
	}
}

export class LocalStorageSaveOptions {
	key: string;
	params?: string;
	data: any;
	expirationMins?: number;
}

export interface CacheRecord {
	value: string;
	params: string;
	expiration?: number;
	hasExpiration: boolean;
}
