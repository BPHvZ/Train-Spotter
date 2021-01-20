import { GeoJSON } from "geojson";

export interface TrainTrackGeoJSON {
	links: { [key: string]: Record<string, unknown> };
	payload: GeoJSON.FeatureCollection;
	meta: { [key: string]: Record<string, unknown> };
}
