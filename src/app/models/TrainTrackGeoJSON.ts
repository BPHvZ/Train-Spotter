import {GeoJSON} from 'geojson';

export interface TrainTrackGeoJSON {
  links: { [key: string]: object };
  payload: GeoJSON.FeatureCollection;
  meta: { [key: string]: object };
}
