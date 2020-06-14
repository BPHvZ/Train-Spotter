import {TrainDetails} from './TrainDetails';
import {MapImageData} from 'ngx-mapbox-gl';

export interface BasicTrain {
  links: { [key: string]: object };
  payload: Payload;
  meta: { [key: string]: object };
}

interface Payload {
  treinen: BasicTrainPayload[];
}

export class BasicTrainPayload {
  treinNummer: number;
  ritId: string;
  lat: number;
  lng: number;
  snelheid: number;
  richting: number;
  horizontaleNauwkeurigheid: number;
  type: string;
  bron: string;
  trainDetails?: TrainDetails;
  trainIconOnMap?: TrainIconOnMap;
  trainIconName?: string;
}

export interface TrainIconOnMap {
  imageName: string;
  imageURL?: string;
  imageData?: ImageData;
  imageObjectURL?: string;
}
