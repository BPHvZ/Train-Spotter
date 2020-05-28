import { Component, OnInit } from '@angular/core';
import {TrainMapType} from '../models/train-map-type';
import {interval, Observable, PartialObserver, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { pausable, PausableObservable } from 'rxjs-pausable';
import {ApiService} from '../services/api.service';
import {Station, StationPayload} from '../models/Station';
import {HelperFunctionsService} from '../services/helper-functions.service';
import {GeoJSON} from 'geojson';
import { environment } from '../../environments/environment';
import {debuglog} from 'util';

@Component({
  selector: 'app-train-map',
  templateUrl: './train-map.component.html',
  styleUrls: ['./train-map.component.sass']
})
export class TrainMapComponent implements OnInit {
  mapStyle = environment.MAPBOX_STYLE;
  lng = 5.4760;
  lat = 52.1284;
  zoom = 6.73;
  private progressNum = 100;
  updateTrainsIsPaused = false;
  isUpdatingMapData = false;
  mapTypes: TrainMapType[] = [
    {
      name: 'Normaal',
      description: 'Kaart met alleen treinen en stations',
      layerId: 'ns-railroad'
    },
    {
      name: 'Storingen',
      description: 'Kaart met treinen, stations en actuele storingen',
      layerId: 'storingen-railroad'
    }
  ];
  activeMapType: TrainMapType = this.mapTypes[0];
  stationsLayerData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
    type: 'FeatureCollection',
    features: []
  };
  trainTracksLayerData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
    type: 'FeatureCollection',
    features: []
  };
  disruptedTrainTracksLayerData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
    type: 'FeatureCollection',
    features: []
  };

  updateTrainsTimer: PausableObservable<number>;
  timerObserver: PartialObserver<number>;

  constructor(
    private apiService: ApiService,
    private helperFunctions: HelperFunctionsService
  ) { }

  /**
   * Set {@link updateTrainsTimer} and {@link progressNum}
   */
  ngOnInit(): void {
    this.updateTrainsTimer = interval(1000).pipe(pausable()) as PausableObservable<number>;
    this.updateTrainsTimer.pause();

    this.timerObserver = {
      next: (_: number) => {
        if (this.progressNum > 0) {
          this.progressNum -= 25;
        } else if (this.progressNum <= 0) {
          this.progressNum = 100;
          console.log('update');
        }
      }
    };
    this.updateTrainsTimer.subscribe(this.timerObserver);
    this.onMapLoad(null);
  }

  /**
   * get the progress used by the progress indicator
   */
  get getProgress() {
    return `${this.progressNum}%`;
  }

  /**
   * pause or resume the {@link updateTrainsTimer}
   */
  pauseOrResumeUpdatingTrainPositions() {
    if (this.updateTrainsIsPaused) {
      this.updateTrainsTimer.resume();
    } else {
      this.updateTrainsTimer.pause();
    }
    this.updateTrainsIsPaused = !this.updateTrainsIsPaused;
  }

  /**
   * Function that's fired when the map is done loading
   * @param $event information about the map on load
   */
  onMapLoad($event) {
    this.isUpdatingMapData = true;
    console.log($event);
    this.apiService.getBasicInformationAboutAllStations().subscribe(
      station => {
      console.log(station);
      this.addStationsToMap(station.payload);
      },
      error => console.log(error),
      () => {
      this.isUpdatingMapData = false;
    });
    this.apiService.getTrainTracksGeoJSON().subscribe(trainTracks => {
      this.trainTracksLayerData = trainTracks.payload;
    });
    this.apiService.getDisruptedTrainTracksGeoJSON().subscribe(trainTracks => {
      this.disruptedTrainTracksLayerData = trainTracks.payload;
    });
  }

  addStationsToMap(stations: StationPayload[]) {
    // console.log(JSON.stringify(this.helperFunctions.parseToGeoJSON(stations, ['lng', 'lat'], ['code', 'namen'])));
    this.stationsLayerData = this.helperFunctions.parseToGeoJSON(stations, ['lng', 'lat'], ['code', 'namen']);
  }
}
