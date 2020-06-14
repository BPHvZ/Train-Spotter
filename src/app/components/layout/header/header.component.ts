import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {StationPayload} from '../../../models/Station';
import {NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';
import {HeaderEventsService} from '../../../services/header-events.service';
import {Router} from '@angular/router';

/**
 * Header with links to pages and a dropdown to search for stations
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  searching = false;
  searchFailed = false;

  constructor(
    private apiService: ApiService,
    private headerEventsService: HeaderEventsService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  /**
   * Search stations on name or abbreviation
   * @param text$ Input text
   * @return List of stations
   */
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.apiService.searchForStation(term).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )

  /**
   * Get the station name from {@link StationPayload.namen}
   * @param station Station to get the name from
   * @return The station name
   */
  formatToStationName(station: StationPayload): string {
    return station.namen.lang;
  }

  /**
   * Select a station and sent event to train map to fly to it
   * @param event Selected station from dropdown
   */
  selectStationFromSearch(event: NgbTypeaheadSelectItemEvent) {
    event.preventDefault();
    this.headerEventsService.selectStation(event.item);
  }

  /**
   * Navigate to the stations overview page
   */
  navigatToAllStations() {
    this.router.navigateByUrl('stations');
  }
}
