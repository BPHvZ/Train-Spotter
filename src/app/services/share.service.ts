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

/** Share using browser Navigator.share */
@Injectable({
	providedIn: "root",
})
export class ShareService {
	/**
	 * Share text, url or files using the browser Navigator.share
	 * @param shareData text, url or files to share
	 * @param alternative Function to execute when Navigator.share is not available in the browser
	 */
	async share(shareData: ShareData, alternative: () => void): Promise<void> {
		if (typeof window.navigator.share === "function") {
			try {
				await window.navigator.share(shareData);
				console.log("Share was successful.");
			} catch (error) {
				console.log("Sharing failed", error);
			}
		} else {
			console.error("Cannot use Web Share API: API unavailable.");
			alternative();
		}
	}
}
