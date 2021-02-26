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

import Jimp from "jimp";
import { forkJoin, from, Observable } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { NSTrainIcon } from "../models/VirtualTrainAPI";

/**ReplaceColor library*/
// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
const replaceColor = require("replace-color");

/**
 * For each icon:
 * - Download
 * - Resize
 * - Remove the background
 * - Get buffer
 * @param iconURLs All icons with their url and name
 * @returns Observable<NSTrainIcon[]> All downloaded and edited icons
 */
export const jimpPrepareIcons = (iconURLs: Map<string, string>): Observable<NSTrainIcon[]> => {
	return forkJoin(
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
	);
};
