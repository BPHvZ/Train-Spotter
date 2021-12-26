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
import { get } from "lodash";
import { DetailedTrainInformation } from "../models/VirtualTrainAPI";

/**
 * Helper functions that are used by multiple components
 */
@Injectable({
	providedIn: "root",
})
export class HelperFunctionsService {
	/**
	 * Parse an array of objects to GeoJSON
	 * @param data Array of objects of type {@link T}
	 * @param point Property names of Lat and Lng data
	 * @param properties Proporties of {@link T} to include
	 * @param allProperties Include all properties
	 * @returns FeatureCollection<Point, any> GeoJSON of the data
	 */
	parseToGeoJSON<T>(
		data: Array<T>,
		point: Array<string>,
		properties?: Array<string>,
		allProperties = false
	): FeatureCollection<Point, any> {
		const featureCollection: FeatureCollection<Point, any> = {
			type: "FeatureCollection",
			features: [],
		};
		data.forEach((feature) => {
			const lng = get(feature, point[0]) as number;
			const lat = get(feature, point[1]) as number;
			if (lng !== null && lat !== null) {
				const geoFeature: Feature<Point, any> = {
					geometry: {
						coordinates: [lng, lat],
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

	/**
	 * Convert train type abbreviation to full words
	 * @param train Train to convert train type for
	 * @returns string Train type
	 */
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

	/**
	 * Compare two object to see if they are the same
	 * Compare keys and data of keys
	 * @param object1 Object one
	 * @param object2 Object two
	 * @returns boolean True if objects are the same
	 */
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	objectsAreEqual(object1: any, object2: any): boolean {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const keys1 = Object.keys(object1);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
