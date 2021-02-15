import { Train } from "./VirtualTrainAPI";
import { Station } from "./ReisinformatieAPI";

export enum GlobalSearchResultType {
	TrainRideId,
	TrainSetNumber,
	Station,
}

export interface GlobalSearchResult {
	resultType: GlobalSearchResultType;
	result: Train | Station;
	searchField: number | string;
}
