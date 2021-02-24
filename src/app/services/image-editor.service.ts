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
import { jimpPrepareIcons } from "../helpers/jimp-helper";
import { NSTrainIcon } from "../models/VirtualTrainAPI";

@Injectable({
	providedIn: "root",
})
export class ImageEditorService {
	private worker = new Worker("../workers/jimp.worker", { type: "module" });
	private canUseWorker = false;

	constructor() {
		if (typeof Worker !== "undefined") {
			this.canUseWorker = true;
		}
	}

	prepareTrainIcons(iconURLs: Map<string, string>): Observable<NSTrainIcon[]> {
		const resultSubject = new Subject<NSTrainIcon[]>();
		if (this.canUseWorker) {
			this.worker.onmessage = ({ data }: { data: NSTrainIcon[] }) => {
				resultSubject.next(data);
				resultSubject.complete();
			};
			this.worker.postMessage(iconURLs);
		} else {
			jimpPrepareIcons(iconURLs).subscribe((value) => {
				resultSubject.next(value);
				resultSubject.complete();
			});
		}
		return resultSubject;
	}
}
