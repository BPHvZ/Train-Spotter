import { Injectable } from '@angular/core';
import {Point, FeatureCollection, Feature} from 'geojson';

@Injectable({
  providedIn: 'root'
})
export class HelperFunctionsService {

  constructor() { }

  parseToGeoJSON<T>(data: Array<T>, point: Array<string>, properties?: Array<string>, allProperties: boolean = false): FeatureCollection {
    const featureCollection: FeatureCollection<Point, any> = {
      type: 'FeatureCollection',
      features: []
    };
    data.forEach((feature) => {
      if (feature[point[0]] !== null && feature[point[1]] !== null) {
        const geoFeature: Feature<Point, any> = {
          geometry: {
            coordinates: [feature[point[0]], feature[point[1]]],
            type: 'Point',
          },
          properties: {},
          type: 'Feature',
        };
        let pointProperties = properties;
        if (allProperties) {
          pointProperties = Object.keys(feature);
        }
        pointProperties.forEach((property) => {
          if (feature[property] !== undefined) {
            geoFeature.properties[property] = feature[property];
          }
        });
        featureCollection.features.push(geoFeature);
      }
    });

    return featureCollection;
  }
}
