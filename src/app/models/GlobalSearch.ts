import { Station } from "./ReisinformatieAPI";
import { Train } from "./VirtualTrainAPI";

export enum GlobalSearchResultType {
	Train,
	Station,
}

export interface GlobalSearchResult {
	resultType: GlobalSearchResultType;
	result: Train | Station;
	searchField: number | string;
}
