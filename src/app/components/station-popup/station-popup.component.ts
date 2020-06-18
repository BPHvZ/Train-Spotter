import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MapboxGeoJSONFeature} from 'mapbox-gl';
import {StationPayload} from '../../models/Station';

/**
 * Show a popup with information about a station on the train map
 */
@Component({
  selector: 'app-station-popup',
  templateUrl: './station-popup.component.html',
  styleUrls: ['./station-popup.component.sass']
})
export class StationPopupComponent implements OnChanges {
  @Output() public closePopup: EventEmitter<any> = new EventEmitter();
  @Input() mapboxFeature: MapboxGeoJSONFeature;
  stationInformation: StationPayload;

  constructor() {
  }

  /**
   * Set the station information on changes
   * @param changes Change with station information
   */
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.mapboxFeature.currentValue) {
      this.stationInformation = this.mapboxFeature.properties as StationPayload;
    }
  }

}