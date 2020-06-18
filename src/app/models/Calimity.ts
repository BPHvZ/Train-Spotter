export interface Calimity {
  links: { [key: string]: object };
  payload: Melding[];
  meta: { [key: string]: object };
}

export interface Melding {
  id: string;
  titel: string;
  beschrijving: string;
  type: MeldingType;
  url: string;
  buttonPositie: string;
  laatstGewijzigd: string;
  volgendeUpdate: string;
  bodyItems: BodyItem[];
  buttons: Button[];
}

export interface BodyItem {
  objectType: string;
  content: string;
}

export interface Button {
  titel: string;
  type: string;
  voorleesTitel: string;
  url?: string;
}

export enum MeldingType {
  Prio1 = 'prio_1',
  Prio2 = 'prio_2',
  Prio3 = 'prio_3',
  storing = 'storing',
  Werkzaamheid = 'werkzaamheid',
  Evenement = 'evenement'
}
