export interface BasicTrain {
  links: { [key: string]: object };
  payload: Payload;
  meta: { [key: string]: object };
}

interface Payload {
  treinen: BasicTrainPayload[];
}

export interface BasicTrainPayload {
  treinNummer: number;
  ritId: string;
  lat: number;
  lng: number;
  snelheid: number;
  richting: number;
  horizontaleNauwkeurigheid: number;
  type: string;
  bron: string;
}
