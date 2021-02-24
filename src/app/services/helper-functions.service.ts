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
import { Feature, FeatureCollection, Point } from "geojson";
import { DetailedTrainInformation } from "../models/VirtualTrainAPI";

@Injectable({
	providedIn: "root",
})
export class HelperFunctionsService {
	parseToGeoJSON<T>(
		data: Array<T>,
		point: Array<string>,
		properties?: Array<string>,
		allProperties: boolean = false
	): FeatureCollection<Point, any> {
		const featureCollection: FeatureCollection<Point, any> = {
			type: "FeatureCollection",
			features: [],
		};
		data.forEach((feature) => {
			if (feature[point[0]] !== null && feature[point[1]] !== null) {
				const geoFeature: Feature<Point, any> = {
					geometry: {
						coordinates: [feature[point[0]], feature[point[1]]],
						type: "Point",
					},
					properties: {},
					type: "Feature",
				};
				let pointProperties = properties;
				if (allProperties) {
					pointProperties = Object.keys(feature);
				}
				pointProperties.forEach((property) => {
					if (feature[property] !== undefined) {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
						geoFeature.properties[property] = feature[property];
					}
				});
				featureCollection.features.push(geoFeature);
			}
		});

		return featureCollection;
	}

	getTypeOfTrain(train: DetailedTrainInformation): string {
		const type = train.type;
		if (type === "SPR") {
			return "Sprinter";
		} else if (type === "IC") {
			return "Intercity";
		} else {
			return type;
		}
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	trainsAreEqual(object1: any, object2: any): boolean {
		const keys1 = Object.keys(object1);
		const keys2 = Object.keys(object2);

		if (keys1.length !== keys2.length) {
			return false;
		}

		for (const key of keys1) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (object1[key] !== object2[key]) {
				return false;
			}
		}

		return true;
	}
}
