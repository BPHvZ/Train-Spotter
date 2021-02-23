import { definitions } from "./NS_API_swagger_models/Virtual_Train_API";

interface TrainInformationResponse {
	self?: {
		uri?: string;
		params?: { [key: string]: string };
		title?: string;
		rel?: string;
		uriBuilder?: { [key: string]: any };
		rels?: string[];
		type?: string;
	};
	links?: {
		[key: string]: {
			uri?: string;
			params?: { [key: string]: string };
			title?: string;
			rel?: string;
			uriBuilder?: { [key: string]: any };
			rels?: string[];
			type?: string;
		};
	};
	payload?: {
		treinen?: Train[];
	};
	meta?: { [key: string]: { [key: string]: any } };
}

interface ExtraTrainInformation {
	trainDetails?: TrainInformation;
	trainIconOnMap?: TrainIconOnMap;
	trainIconName?: string;
}

interface TrainIconOnMap {
	imageName: string;
	imageURL?: string;
	imageData?: ImageData;
	imageObjectURL?: string;
}

export interface NSTrainIcon {
	imageName: string;
	image: Buffer;
}

type Train = definitions["Trein"];
type TrainInformation = definitions["TreinInformatie"];
type DetailedTrainInformation = Train & ExtraTrainInformation;
