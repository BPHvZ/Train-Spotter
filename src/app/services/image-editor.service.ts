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
import { Observable, Subject } from "rxjs";
import { take } from "rxjs/operators";
import { jimpPrepareIcons } from "../helpers/jimp-helper";
import { NSTrainIcon } from "../models/VirtualTrainAPI";

/**
 * Use a Web Worker to download and edit images
 */
@Injectable({
	providedIn: "root",
})
export class ImageEditorService {
	/**Jimp Web Worker*/
	private worker = new Worker(new URL("../workers/jimp.worker", import.meta.url), { type: "module" });
	/**Browser supports Web Workers*/
	private canUseWorker = false;

	/**
	 * Check if browser supports Web Workers
	 */
	constructor() {
		if (typeof Worker !== "undefined") {
			this.canUseWorker = true;
		}
	}

	/**
	 * Send message to Web Worker to prepare train icons
	 * If not supported, use main thread
	 * @param iconURLs All icons with their url and name
	 * @returns Observable<NSTrainIcon[]> All downloaded and edited icons
	 */
	prepareTrainIcons(iconURLs: Map<string, string>): Observable<NSTrainIcon[]> {
		const resultSubject = new Subject<NSTrainIcon[]>();
		if (this.canUseWorker) {
			this.worker.onmessage = ({ data }: { data: NSTrainIcon[] }) => {
				resultSubject.next(data);
				resultSubject.complete();
			};
			this.worker.postMessage(iconURLs);
		} else {
			jimpPrepareIcons(iconURLs)
				.pipe(take(1))
				.subscribe((value) => {
					resultSubject.next(value);
					resultSubject.complete();
				});
		}
		return resultSubject;
	}
}
