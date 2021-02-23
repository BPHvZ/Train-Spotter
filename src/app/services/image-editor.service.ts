import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class ImageEditorService {
	worker = new Worker("../workers/jimp.worker", { type: "module" });

	constructor() {
		// if (typeof Worker !== "undefined") {
		// 	// Create a new
		// 	const worker = new Worker("./app.worker", { type: "module" });
		// 	worker.onmessage = ({ data }) => {
		// 		console.log(`page got message: ${data}`);
		// 	};
		// 	worker.postMessage("hello");
		// } else {
		// 	// Web Workers are not supported in this environment.
		// 	// You should add a fallback so that your program still executes correctly.
		// }
	}

	prepareTrainIcons(iconURLs: Map<string, string>): Observable<[(string | Buffer)[]]> {
		const resultSubject = new Subject<[(string | Buffer)[]]>();
		this.worker.onmessage = ({ data }: { data: [(string | Buffer)[]] }) => {
			console.log("Return van worker");
			console.log(typeof data);
			console.log(data);
			resultSubject.next(data);
			resultSubject.complete();
		};
		this.worker.postMessage(iconURLs);
		return resultSubject;
	}

	// compressImageWithWorker(base64image: string): Observable<string> {
	// 	const resultSubject = new Subject<string>();
	// 	this.worker.onmessage = ({ data }: { data: string }) => {
	// 		resultSubject.next(data);
	// 	};
	// 	this.worker.postMessage(base64image);
	// 	return resultSubject;
	// }
}
