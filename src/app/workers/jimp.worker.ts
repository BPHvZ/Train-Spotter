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

/// <reference lib="webworker" />
import { take } from "rxjs/operators";
import { jimpPrepareIcons } from "../helpers/jimp-helper";

/**
 * Receive Web Worker message
 * For each icon:
 * - Download
 * - Resize
 * - Remove the background
 * - Get buffer
 * Data: Map<string, string> = All icons with their url and name
 * @returns NSTrainIcon[] All downloaded and edited icons
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
addEventListener("message", ({ data }: { data: Map<string, string> }) => {
	console.log("WORKER");
	console.log(data);
	const iconURLs: Map<string, string> = data;
	jimpPrepareIcons(iconURLs)
		.pipe(take(1))
		.subscribe((value) => postMessage(value));
});
