/// <reference lib="webworker" />
import { jimpPrepareIcons } from "../helpers/jimp-helper";

// eslint-disable-next-line @typescript-eslint/no-misused-promises
addEventListener("message", ({ data }: { data: Map<string, string> }) => {
	console.log("WORKER");
	console.log(data);
	const iconURLs: Map<string, string> = data;
	jimpPrepareIcons(iconURLs).subscribe((value) => postMessage(value));
});
