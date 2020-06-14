export interface TrainDetails {
  bakbord?: number;
  bron?: Bron;
  crowdInfoRequest?: string;
  crowdInfoResponse?: string;
  drukteVoorspelling?: { [key: string]: any };
  geplandeLengte?: number;
  geplandeMaterieeldelen?: GeplandeMaterieeldelen[];
  ingekort?: boolean;
  lengte?: number;
  lengteInMeters?: number;
  lengteInPixels?: number;
  materieeldelen?: Materieeldelen[];
  perronVoorzieningen?: PerronVoorzieningen[];
  rijrichting?: Rijrichting;
  ritnummer?: number;
  spoor?: string;
  station?: string;
  treinDelen?: TreinDelen[];
  type?: string;
  vervoerder?: string;
}

export enum Bron {
  Dagplan = 'DAGPLAN',
  Dvs = 'DVS',
  Kv6 = 'KV6',
  Nmbs = 'NMBS',
  Obis = 'OBIS',
}

export interface GeplandeMaterieeldelen {
  afbeelding?: string;
  afbeeldingsSpecs?: GeplandeMaterieeldelenAfbeeldingsSpecs;
  bakken?: GeplandeMaterieeldelenBakken[];
  drukteSVGPath?: string;
  eindbestemming?: string;
  faciliteiten?: Faciliteiten[];
  materieelnummer?: number;
  materieelType?: MaterieelType;
  type?: string;
  zitplaatsInfo?: GeplandeMaterieeldelenZitplaatsInfo;
}

export interface GeplandeMaterieeldelenAfbeeldingsSpecs {
  height?: number;
  imageUrl?: string;
  width?: number;
}

export interface GeplandeMaterieeldelenBakken {
  afbeelding?: { [key: string]: any };
  drukte?: Drukte;
}

export enum Drukte {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM',
  Unknown = 'UNKNOWN',
}

export enum Faciliteiten {
  Bistro = 'BISTRO',
  Fiets = 'FIETS',
  Stilte = 'STILTE',
  Stroom = 'STROOM',
  Toegankelijk = 'TOEGANKELIJK',
  Toilet = 'TOILET',
  Wifi = 'WIFI',
}

export enum MaterieelType {
  Cprotos2 = 'CPROTOS_2',
  DBAvmz = 'DB_AVMZ',
  DBB15 = 'DB_B15',
  DBBer99 = 'DB_BER9_9',
  DBBpmz = 'DB_BPMZ',
  DBRegio643 = 'DB_REGIO_643',
  Ddar3 = 'DDAR_3',
  Ddm14Ddm = 'DDM1_4DDM',
  Ddz4 = 'DDZ_4',
  Ddz4Sa = 'DDZ_4SA',
  Ddz6 = 'DDZ_6',
  Dm902 = 'DM90_2',
  Eloc1700 = 'ELOC_1700',
  ElocTr25 = 'ELOC_TR25',
  ElocTrax = 'ELOC_TRAX',
  ElocTrbe = 'ELOC_TRBE',
  Eurostar = 'EUROSTAR',
  Flirt2 = 'FLIRT_2',
  Flirt2_Arr = 'FLIRT_2_ARR',
  Flirt2_Rnet = 'FLIRT_2_RNET',
  Flirt3 = 'FLIRT_3',
  Flirt3_Arr = 'FLIRT_3_ARR',
  Flirt3_Blauwnet = 'FLIRT_3_BLAUWNET',
  Flirt3_Fff = 'FLIRT_3_FFF',
  Flirt3_Keolis = 'FLIRT_3_KEOLIS',
  Flirt3_NS = 'FLIRT_3_NS',
  Flirt4 = 'FLIRT_4',
  Flirt4_Fff = 'FLIRT_4_FFF',
  Flirt4_Keolis = 'FLIRT_4_KEOLIS',
  Flirt4_NS = 'FLIRT_4_NS',
  Flirt4_Sy = 'FLIRT_4_SY',
  FlirtAbellio = 'FLIRT_ABELLIO',
  FlirtConnexxion = 'FLIRT_CONNEXXION',
  Gtw26 = 'GTW26',
  Gtw26Arriva = 'GTW26_ARRIVA',
  Gtw26Limburg = 'GTW26_LIMBURG',
  Gtw26Qbuzz = 'GTW26_QBUZZ',
  Gtw26Veolia = 'GTW26_VEOLIA',
  Gtw28 = 'GTW28',
  Gtw28Arriva = 'GTW28_ARRIVA',
  Gtw28Limburg = 'GTW28_LIMBURG',
  Gtw28Qbuzz = 'GTW28_QBUZZ',
  Gtw28Veolia = 'GTW28_VEOLIA',
  Gtw8Breng = 'GTW8_BRENG',
  Gtwe26 = 'GTWE26',
  Gtwe26Arriva = 'GTWE26_ARRIVA',
  Gtwe26Limburg = 'GTWE26_LIMBURG',
  Gtwe26Vechtdal = 'GTWE26_VECHTDAL',
  Gtwe26Veolia = 'GTWE26_VEOLIA',
  Gtwe28 = 'GTWE28',
  Gtwe28Arriva = 'GTWE28_ARRIVA',
  Gtwe28Limburg = 'GTWE28_LIMBURG',
  Gtwe28Veolia = 'GTWE28_VEOLIA',
  Gtwe28Vetchdal = 'GTWE28_VETCHDAL',
  Ice = 'ICE',
  Ice3 = 'ICE_3',
  Icm3 = 'ICM3',
  Icm4 = 'ICM4',
  Icr7 = 'ICR_7',
  IcrBnl6_B10 = 'ICR_BNL_6_B10',
  IcrBnn6_B10 = 'ICR_BNN_6_B10',
  IcrGv19_B10 = 'ICR_GV1_9_B10',
  IcrGv29_B10 = 'ICR_GV2_9_B10',
  IcrHsl6_B10 = 'ICR_HSL_6_B10',
  Lint2 = 'LINT2',
  Lint2Arriva = 'LINT2_ARRIVA',
  Lint2Keolis = 'LINT2_KEOLIS',
  Lint2Syntus = 'LINT2_SYNTUS',
  Lint2Veolia = 'LINT2_VEOLIA',
  Mat64 = 'MAT64',
  Ms754 = 'MS75_4',
  Ms80M3 = 'MS80M3',
  OebbBmz = 'OEBB_BMZ',
  Sgmm2 = 'SGMM_2',
  Sgmm3 = 'SGMM_3',
  Slt4 = 'SLT_4',
  Slt4E = 'SLT_4E',
  Slt4Es = 'SLT_4ES',
  Slt6 = 'SLT_6',
  Slt6E = 'SLT_6E',
  Slt6Es = 'SLT_6ES',
  Sng3 = 'SNG_3',
  Sng4 = 'SNG_4',
  Sw625Kv2_6 = 'SW6_25KV_2_6',
  Sw725Kv2_7 = 'SW7_25KV_2_7',
  Sw925Kv2_9 = 'SW9_25KV_2_9',
  TgvPb = 'TGV_PB',
  Thalys = 'THALYS',
  Unknown = 'UNKNOWN',
  VIRMm14 = 'VIRMm1_4',
  VIRMm16 = 'VIRMm1_6',
  Virm4 = 'VIRM_4',
  Virm6 = 'VIRM_6',
}

export interface GeplandeMaterieeldelenZitplaatsInfo {
  klapstoelEersteKlas?: number;
  klapstoelTweedeKlas?: number;
  staanplaatsEersteKlas?: number;
  staanplaatsTweedeKlas?: number;
  zitplaatsEersteKlas?: number;
  zitplaatsTweedeKlas?: number;
}

export interface Materieeldelen {
  afbeelding?: string;
  afbeeldingsSpecs?: MaterieeldelenAfbeeldingsSpecs;
  bakken?: MaterieeldelenBakken[];
  drukteSVGPath?: string;
  eindbestemming?: string;
  faciliteiten?: Faciliteiten[];
  materieelnummer?: number;
  materieelType?: MaterieelType;
  type?: string;
  zitplaatsInfo?: MaterieeldelenZitplaatsInfo;
}

export interface MaterieeldelenAfbeeldingsSpecs {
  height?: number;
  imageUrl?: string;
  width?: number;
}

export interface MaterieeldelenBakkenAfbeeldingsSpecs {
  hoogte?: number;
  url?: string;
  breedte?: number;
}

export interface MaterieeldelenBakken {
  afbeelding?: MaterieeldelenBakkenAfbeeldingsSpecs;
  drukte?: Drukte;
}

export interface MaterieeldelenZitplaatsInfo {
  klapstoelEersteKlas?: number;
  klapstoelTweedeKlas?: number;
  staanplaatsEersteKlas?: number;
  staanplaatsTweedeKlas?: number;
  zitplaatsEersteKlas?: number;
  zitplaatsTweedeKlas?: number;
}

export interface PerronVoorzieningen {
  description?: string;
  paddingLeft?: number;
  type?: string;
  width?: number;
}

export enum Rijrichting {
  Links = 'LINKS',
  Rechts = 'RECHTS',
}

export interface TreinDelen {
  afbeelding?: string;
  afbeeldingsSpecs?: TreinDelenAfbeeldingsSpecs;
  bakken?: TreinDelenBakken[];
  drukteSVGPath?: string;
  eindbestemming?: string;
  faciliteiten?: Faciliteiten[];
  materieelnummer?: number;
  materieelType?: MaterieelType;
  type?: string;
  zitplaatsInfo?: TreinDelenZitplaatsInfo;
}

export interface TreinDelenAfbeeldingsSpecs {
  height?: number;
  imageUrl?: string;
  width?: number;
}

export interface TreinDelenBakken {
  afbeelding?: { [key: string]: any };
  drukte?: Drukte;
}

export interface TreinDelenZitplaatsInfo {
  klapstoelEersteKlas?: number;
  klapstoelTweedeKlas?: number;
  staanplaatsEersteKlas?: number;
  staanplaatsTweedeKlas?: number;
  zitplaatsEersteKlas?: number;
  zitplaatsTweedeKlas?: number;
}
