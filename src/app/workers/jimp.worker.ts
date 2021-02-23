/// <reference lib="webworker" />
import Jimp from "jimp";
import { forkJoin, from, Observable } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { NSTrainIcon } from "../models/VirtualTrainAPI";
// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
const replaceColor = require("replace-color");

// eslint-disable-next-line @typescript-eslint/no-misused-promises
addEventListener("message", ({ data }: { data: Map<string, string> }) => {
	console.log("WORKER");
	console.log(data);
	const iconURLs: Map<string, string> = data;
	forkJoin(
		Array.from(iconURLs, ([imageName, imageURL]) =>
			from(Jimp.read(imageURL)).pipe(
				mergeMap<Jimp, Observable<Buffer>>((image) => {
					image.resize(Jimp.AUTO, 50).crop(0, 0, 100, 50);
					if (image.hasAlpha()) {
						image.rgba(true).background(0x000000ff);
					}
					return from(image.getBufferAsync(Jimp.MIME_PNG));
				}),
				mergeMap((buffer) =>
					from<Observable<Jimp>>(
						// eslint-disable-next-line @typescript-eslint/no-unsafe-call
						replaceColor({
							image: buffer,
							colors: {
								type: "hex",
								targetColor: "#FFFFFF",
								replaceColor: "#00000000",
							},
						})
					)
				),
				mergeMap((image) => from(image.getBufferAsync(Jimp.MIME_PNG))),
				map((buffer) => {
					const icon: NSTrainIcon = {
						imageName: imageName,
						image: buffer,
					};
					return icon;
				})
			)
		)
	).subscribe((value) => postMessage(value));
});
