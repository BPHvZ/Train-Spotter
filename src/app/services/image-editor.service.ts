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
