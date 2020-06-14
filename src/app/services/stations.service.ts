import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {Station, StationPayload} from '../models/Station';
import {environment} from '../../environments/environment';
import {HttpClientService} from './http-client.service';
import {SortColumn, SortDirection} from '../directives/ngbd-sortable-header.directive';
import {debounceTime, delay, map, switchMap, tap} from 'rxjs/operators';

interface SearchResult {
  stations: StationPayload[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string, v2: string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(stations: StationPayload[], column: SortColumn, direction: string): StationPayload[] {
  if (direction === '' || column === '') {
    return stations;
  } else {
    return [...stations].sort((a, b) => {
      let aColumn = a[column];
      let bColumn = b[column];
      if (column === 'namen') {
        aColumn = a.namen.lang;
        bColumn = b.namen.lang;
      }
      const res = compare(`${aColumn}`, `${bColumn}`);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(station: StationPayload, term: string) {
  return station.namen.lang.toLowerCase().includes(term.toLowerCase()) ||
    station.land.toLowerCase().includes(term.toLowerCase()) ||
    station.EVACode.toString().includes(term) ||
    station.UICCode.toString().includes(term);
}

@Injectable({
  providedIn: 'root'
})
export class StationsService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _stations$ = new BehaviorSubject<StationPayload[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 50,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private http: HttpClientService) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._stations$.next(result.stations);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get stations$() { return this._stations$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }

  get page() { return this._state.page; }
  set page(page: number) { this._set({page}); }

  get pageSize() { return this._state.pageSize; }
  set pageSize(pageSize: number) { this._set({pageSize}); }

  get searchTerm() { return this._state.searchTerm; }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }

  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    return this.getBasicInformationAboutAllStations().pipe(
      // tap(stations => console.log(stations.payload)),
      map(stations => {
        // 1. sort
        let stationPayloads = sort(stations.payload, sortColumn, sortDirection);

        // 2. filter
        stationPayloads = stationPayloads.filter(station => matches(station, searchTerm));
        const total = stationPayloads.length;

        // 3. paginate
        stationPayloads = stationPayloads.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return {stations: stationPayloads, total};
      })
    );
  }

  getBasicInformationAboutAllStations(): Observable<Station> {
    return this.http.get({
      url: 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations',
      cacheMins: 60,
      headers: {
        'Ocp-Apim-Subscription-Key': environment.NS_Ocp_Apim_Subscription_Key
      }
    });
  }
}
