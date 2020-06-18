/**
 * This file was auto-generated by swagger-to-ts.
 * Do not make direct changes to the file.
 */
export interface VirtualTrainAPI {
  Ingekort: {
    geplandeSamenstelling?: string[];
    actueleSamenstelling?: string[];
    geplandeCapaciteit?: number;
    actueleCapaciteit?: number;
    prognose?: number;
    voldoendeAfwijking?: boolean;
    ingekort?: boolean;
    classification?: 'UNKNOWN' | 'HIGH' | 'MEDIUM' | 'LOW';
    verwachting?: number;
    daActueleCapaciteit?: number;
  };
  Afbeelding: { [key: string]: any };
  Treinen: { treinen?: VirtualTrainAPI['Trein'][] };
  ZitplaatsInformatie: {
    staanplaatsEersteKlas?: number;
    staanplaatsTweedeKlas?: number;
    zitplaatsEersteKlas?: number;
    zitplaatsTweedeKlas?: number;
    klapstoelEersteKlas?: number;
    klapstoelTweedeKlas?: number;
  };
  Stop: {
    stopId?: string;
    stopCode?: string;
    stopName?: string;
    lat?: number;
    lng?: number;
    locationType?: string;
    parentStation?: string;
    stopTimezone?: string;
    wheelchairBoarding?: string;
    platformCode?: string;
    zoneId?: string;
    notAnNsStation?: boolean;
    regularStation?: boolean;
  };
  PrognoseInfomatie: {
    verwachting?: number;
    station?: string;
    capaciteit?: number;
    classifiction?: 'UNKNOWN' | 'HIGH' | 'MEDIUM' | 'LOW';
    prognose?: number;
  };
  Bak: {
    afbeelding?: VirtualTrainAPI['Afbeelding'];
    drukte?: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  };
  TreinDrukte: { [key: string]: any };
  MaterieelDeel: {
    materieelDeel?: number;
    lat?: number;
    lng?: number;
    snelheid?: number;
    richting?: number;
  };
  TreinInformatie: {
    crowdInfoResponse?: string;
    crowdInfoRequest?: string;
    bron?: 'DVS' | 'KV6' | 'OBIS' | 'DAGPLAN' | 'NMBS';
    ritnummer?: number;
    station?: string;
    type?: string;
    vervoerder?: string;
    spoor?: string;
    materieeldelen?: VirtualTrainAPI['TreinDeel'][];
    geplandeMaterieeldelen?: VirtualTrainAPI['TreinDeel'][];
    ingekort?: boolean;
    lengte?: number;
    lengteInMeters?: number;
    lengteInPixels?: number;
    geplandeLengte?: number;
    perronVoorzieningen?: VirtualTrainAPI['PerronVoorziening'][];
    bakbord?: number;
    rijrichting?: 'LINKS' | 'RECHTS';
    drukteVoorspelling?: VirtualTrainAPI['TreinDrukte'];
    treinDelen?: VirtualTrainAPI['TreinDeel'][];
  };
  ImageData: { imageUrl?: string; width?: number; height?: number };
  Trein: {
    ritId?: string;
    lat?: number;
    lng?: number;
    snelheid?: number;
    richting?: number;
    horizontaleNauwkeurigheid?: number;
    type?: string;
    materieelDeelList?: VirtualTrainAPI['MaterieelDeel'][];
    treinCloneWithMaterieel?: VirtualTrainAPI['Trein'];
  };
  PerronVoorziening: {
    paddingLeft?: number;
    width?: number;
    type?: string;
    description?: string;
  };
  TreinDeel: {
    materieelType?:
      | 'DDZ_4'
      | 'DDZ_6'
      | 'DDZ_4SA'
      | 'SGMM_2'
      | 'SGMM_3'
      | 'SNG_3'
      | 'SNG_4'
      | 'SLT_4'
      | 'SLT_4E'
      | 'SLT_4ES'
      | 'SLT_6'
      | 'SLT_6E'
      | 'SLT_6ES'
      | 'FLIRT_2'
      | 'FLIRT_2_ARR'
      | 'FLIRT_3_ARR'
      | 'FLIRT_2_RNET'
      | 'FLIRT_3'
      | 'FLIRT_3_NS'
      | 'FLIRT_3_FFF'
      | 'FLIRT_3_BLAUWNET'
      | 'FLIRT_3_KEOLIS'
      | 'FLIRT_4'
      | 'FLIRT_4_NS'
      | 'FLIRT_4_FFF'
      | 'FLIRT_4_SY'
      | 'FLIRT_4_KEOLIS'
      | 'FLIRT_ABELLIO'
      | 'FLIRT_CONNEXXION'
      | 'VIRM_4'
      | 'VIRMm1_4'
      | 'VIRM_6'
      | 'VIRMm1_6'
      | 'DB_REGIO_643'
      | 'DB_BPMZ'
      | 'DB_BER9_9'
      | 'DB_AVMZ'
      | 'DB_B15'
      | 'OEBB_BMZ'
      | 'MS80M3'
      | 'MS75_4'
      | 'DDM1_4DDM'
      | 'ICR_GV1_9_B10'
      | 'ICR_GV2_9_B10'
      | 'ICR_BNL_6_B10'
      | 'ICR_BNN_6_B10'
      | 'ICR_HSL_6_B10'
      | 'ICR_7'
      | 'SW6_25KV_2_6'
      | 'SW7_25KV_2_7'
      | 'SW9_25KV_2_9'
      | 'ELOC_1700'
      | 'ELOC_TR25'
      | 'ELOC_TRBE'
      | 'ELOC_TRAX'
      | 'CPROTOS_2'
      | 'DM90_2'
      | 'DDAR_3'
      | 'EUROSTAR'
      | 'THALYS'
      | 'TGV_PB'
      | 'ICE'
      | 'ICE_3'
      | 'MAT64'
      | 'GTW26'
      | 'GTWE26'
      | 'GTW28'
      | 'GTWE28'
      | 'GTWE26_VECHTDAL'
      | 'GTWE28_VETCHDAL'
      | 'GTW26_LIMBURG'
      | 'GTW28_LIMBURG'
      | 'GTWE26_LIMBURG'
      | 'GTWE28_LIMBURG'
      | 'GTW26_ARRIVA'
      | 'GTW28_ARRIVA'
      | 'GTWE26_ARRIVA'
      | 'GTWE28_ARRIVA'
      | 'GTW26_VEOLIA'
      | 'GTW28_VEOLIA'
      | 'GTWE26_VEOLIA'
      | 'GTWE28_VEOLIA'
      | 'GTW8_BRENG'
      | 'GTW26_QBUZZ'
      | 'GTW28_QBUZZ'
      | 'LINT2'
      | 'LINT2_ARRIVA'
      | 'LINT2_VEOLIA'
      | 'LINT2_SYNTUS'
      | 'LINT2_KEOLIS'
      | 'ICM3'
      | 'ICM4'
      | 'UNKNOWN';
    drukteSVGPath?: string;
    materieelnummer?: number;
    type?: string;
    faciliteiten?: (
      | 'TOILET'
      | 'STILTE'
      | 'STROOM'
      | 'TOEGANKELIJK'
      | 'FIETS'
      | 'WIFI'
      | 'BISTRO'
    )[];
    afbeelding?: string;
    eindbestemming?: string;
    bakken?: VirtualTrainAPI['Bak'][];
    afbeeldingsSpecs?: VirtualTrainAPI['ImageData'];
    zitplaatsInfo?: VirtualTrainAPI['ZitplaatsInformatie'];
  };
  ApiV1IngekortGetdefaultApplicationJsonResponse: string;
  ApiV2IngekortGetdefaultApplicationJsonResponse: string;
}
