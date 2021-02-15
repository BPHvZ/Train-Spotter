import { Train } from "./VirtualTrainAPI";
import { Station } from "./ReisinformatieAPI";

export enum GlobalSearchResultType {
	TrainRideId,
	TrainSetNumber,
	Station,
}

export interface GlobalSearchResult {
	type: GlobalSearchResultType;
	result: Train | Station;
	searchField: number | string;
}
