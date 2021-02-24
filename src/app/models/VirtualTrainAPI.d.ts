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
