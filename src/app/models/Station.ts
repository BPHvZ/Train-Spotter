export interface Station {
  links: { [key: string]: object };
  payload: StationPayload[];
  meta: { [key: string]: object };
}

export interface Tracks {
  spoorNummer: string;
}

export interface Names {
  lang: string;
  kort: string;
  middel: string;
}

export interface StationPayload {
  sporen: Tracks[];
  synoniemen: string[];
  heeftFaciliteiten: boolean;
  heeftVertrektijden: boolean;
  heeftReisassistentie: boolean;
  code: string;
  namen: Names;
  stationType: string;
  land: string;
  UICCode: string;
  lat: number;
  lng: number;
  radius: number;
  naderenRadius: number;
  EVACode: string;
  ingangsDatum: string;
}
