import {Melding} from './Calimity';

export interface Disruption {
  links: { [key: string]: object };
  payload: Payload[];
  meta: { [key: string]: object };
}

export interface Payload {
  id: string;
  type: DisruptionType;
  titel: string;
  url?: string;
  topic?: string;
  melding?: Melding; // used with prio_x disruptions
  verstoring?: Verstoring;
}

export enum DisruptionType {
  Storing = 'storing',
  Werkzaamheid = 'werkzaamheid'
}

export interface Verstoring {
  type: VerstoringType;
  id: string;
  baanvakBeperking?: BaanvakBeperking[];
  reden?: string;
  extraReistijd: string;
  leafletUrl?: string;
  reisadviezen?: Reisadviezen;
  geldigheidsLijst?: GeldigheidsLijst[];
  verwachting?: string;
  gevolg?: string;
  gevolgType?: string;
  fase?: string;
  faseLabel?: string;
  impact?: number;
  maatschappij?: number;
  alternatiefVervoer?: string;
  landelijk?: boolean;
  oorzaak?: Oorzaak;
  header?: string;
  meldtijd?: string;
  periode?: string;
  baanvakken?: Baanvak[];
  trajecten?: Traject[];
  versie?: string;
  volgnummer?: string;
  prioriteit?: number;
  translatableTexts?: string[];
}

export enum VerstoringType {
  Prio1 = 'MELDING_PRIO_1',
  Prio2 = 'MELDING_PRIO_2',
  Prio3 = 'MELDING_PRIO_3',
  Strong = 'STORING',
  Werkzaamheid = 'WERKZAAMHEID',
  Evenement = 'EVENEMENT'
}

export interface BaanvakBeperking {
  van?: StationCode;
  tot?: StationCode;
  via?: StationCode[];
  richting?: BaanvakBeperkingRichting;
}

export interface StationCode {
  code?: string;
  empty?: boolean;
}

export enum BaanvakBeperkingRichting {
  Heen = 'HEEN',
  HeenEnTerug = 'HEEN_EN_TERUG'
}

export interface Reisadviezen {
  titel: string;
  translatableTexts?: string[];
  reisadvies: Reisadvies[];
}

export interface Reisadvies {
  advies: string[];
  titel?: string;
}

export interface GeldigheidsLijst {
  startDatum: Date;
  eindDatum: Date;
  startTijd?: string;
  eindTijd?: string;
}

export enum Oorzaak {
  AangepasteDienstregeling = 'aangepaste dienstregeling',
  GeplandeWerkzaamheden = 'geplande werkzaamheden',
  Werkzaamheden = 'werkzaamheden',
  WerkzaamhedenAanDeHogesnelheidslijn = 'werkzaamheden aan de hogesnelheidslijn',
  WerkzaamhedenElders = 'werkzaamheden elders',
}

export interface Baanvak {
  stations?: string[];
}

export interface Traject {
  stations: string[];
  begintijd: Date;
  eindtijd: Date;
  richting: BaanvakBeperkingRichting;
  gevolg: Gevolg;
}

export interface Gevolg {
  stations: string[];
  niveau: string;
}