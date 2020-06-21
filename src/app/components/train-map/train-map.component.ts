import {Component, OnInit} from '@angular/core';
import {TrainMapType} from '../../models/TrainMapType';
import {forkJoin, from, interval, Observable, PartialObserver, Subject, zip} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {pausable, PausableObservable} from 'rxjs-pausable';
import {ApiService} from '../../services/api.service';
import {StationPayload} from '../../models/Station';
import {HelperFunctionsService} from '../../services/helper-functions.service';
import {GeoJSON, MultiLineString} from 'geojson';
import {environment} from '../../../environments/environment';
import {TrainInformation, TrainIconOnMap} from '../../models/BasicTrain';
import * as Jimp from 'jimp';
import {Map as MapBoxMap, MapboxGeoJSONFeature, MapLayerMouseEvent, MapMouseEvent} from 'mapbox-gl';
import {HeaderEventsService} from '../../services/header-events.service';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {StationsService} from '../../services/stations.service';
import {Disruption, DisruptionPayload} from '../../models/Disruption';

const replaceColor = require('replace-color');

/**
 * Train map with stations and trains that get update every x seconds
 */
@Component({
  selector: 'app-train-map',
  templateUrl: './train-map.component.html',
  styleUrls: ['./train-map.component.sass']
})
export class TrainMapComponent implements OnInit {
  trainMap: MapBoxMap;
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
  sidebarIsOpen = false;

  selectedTrainOnMapFeature: MapboxGeoJSONFeature;
  selectedStationOnMapFeature: MapboxGeoJSONFeature;

  stationsLayerData: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
  trainTracksLayerData: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
  trainsLayerData: GeoJSON.FeatureCollection<GeoJSON.Geometry>;

  disruptedTrainTracksLayerData: GeoJSON.FeatureCollection<MultiLineString>;
  disruptionMarkersData: GeoJSON.Feature<GeoJSON.Point, DisruptionPayload>[];
  actualDisruptions: Disruption;

  private trainIconAddedSource = new Subject<string>();
  trainIconAdded = this.trainIconAddedSource.asObservable();
  private trainIconNames: Set<string> = new Set<string>();
  private trainIconsAdded: Set<string> = new Set<string>();
  trainIconsForMap: TrainIconOnMap[] = [];

  updateTrainsTimer: PausableObservable<number>;
  timerObserver: PartialObserver<number>;

  constructor(
    private apiService: ApiService,
    private stationsService: StationsService,
    private helperFunctions: HelperFunctionsService,
    private headerEventsService: HeaderEventsService,
    private router: Router
  ) {
  }

  /**
   * Set {@link updateTrainsTimer} and {@link progressNum}
   * Fly to station when {@link HeaderEventsService.currentSelectedStation} receives an event
   * Fly to station when this component is reused and navigated to from another component with extra state parameters
   */
  ngOnInit(): void {
    this.updateTrainsTimer = interval(1000).pipe(pausable()) as PausableObservable<number>;
    this.pauseOrResumeUpdatingTrainPositions(true);

    this.timerObserver = {
      next: (_: number) => {
        if (this.progressNum > 0) {
          this.progressNum -= 10;
        } else if (this.progressNum <= 0) {
          this.progressNum = 100;
          this.getActiveTrainsAndDetails();
        }
      }
    };
    this.updateTrainsTimer.subscribe(this.timerObserver);
    this.headerEventsService.currentSelectedStation.subscribe(station => this.flyToStation(station));

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log(event.url);
      }
      if (event instanceof NavigationEnd && event.url === '/kaart') {
        const navigationState = this.router.getCurrentNavigation().extras.state;
        if (navigationState) {
          if (navigationState.station) {
            this.flyToStation(navigationState.station);
          }
        }
      }
    });
  }

  /**
   * get the progress used by the progress indicator
   */
  get getProgress() {
    return `${this.progressNum}%`;
  }

  /**
   * Receive an event when a train icon has been loaded
   * @param trainIconName The train icon name
   */
  onIconLoad(trainIconName) {
    this.trainIconAddedSource.next(trainIconName);
  }

  /**
   * pause or resume the {@link updateTrainsTimer}
   * @param pause Whether to pause the train updater or not
   */
  pauseOrResumeUpdatingTrainPositions(pause: boolean) {
    if (this.isUpdatingMapData === false) {
      if (pause === false) {
        this.updateTrainsTimer.resume();
        this.updateTrainsIsPaused = false;
      } else {
        this.updateTrainsTimer.pause();
        this.updateTrainsIsPaused = true;
      }
    }
  }

  /**
   * Get stations and train information when map is loaded
   * @param trainMap information about the map on load
   */
  onMapLoad(trainMap: MapBoxMap) {
    this.trainMap = trainMap;
    this.isUpdatingMapData = true;
    zip(
      this.stationsService.getBasicInformationAboutAllStations(),
      this.apiService.getTrainTracksGeoJSON(),
      this.apiService.getDisruptedTrainTracksGeoJSON(),
      this.apiService.getActualDisruptions()
    ).subscribe({
      next: value => {
        console.log(value);
        this.addStationsToMap(value[0].payload);
        this.trainTracksLayerData = value[1].payload;
        this.disruptedTrainTracksLayerData = value[2].payload as GeoJSON.FeatureCollection<MultiLineString>;
        this.actualDisruptions = value[3];
        this.actualDisruptions.payload.forEach(dis => {
          console.log(dis.type);
        });
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        this.getActiveTrainsAndDetails();
        this.setDisruptionMarkers();
      }
    });
  }

  /**
   * Alter train icon size when zooming on train map
   * @param event Zoom event
   */
  onMapZoom(event: MapMouseEvent) {
    const trainLayer = event.target.getLayer('trains');
    if (trainLayer) {
      const zoom = event.target.getZoom();
      // console.log(zoom);
      if (zoom >= 7) {
        const iconSize = zoom * (0.4 / 7);
        event.target.setLayoutProperty('trains', 'icon-size', iconSize);
      }
    }
  }

  /**
   * Change cursor style when hovering over a station or train
   * @param event Mouse move event
   */
  onMapMouseMove(event: MapLayerMouseEvent) {
    const trainLayer = event.target.getLayer('trains');
    if (this.stationsLayerData && this.trainsLayerData && this.trainIconsForMap && trainLayer) {
      const features = event.target.queryRenderedFeatures(event.point, {
        layers: ['trains', 'stations']
      });
      event.target.getCanvas().style.cursor = features.length ? 'pointer' : '';
    }
  }

  changeMapLayerType(layer: TrainMapType) {
    this.activeMapType = layer;
    this.sidebarIsOpen = this.activeMapType.layerId !== 'ns-railroad';
  }

  /**
   * Open a station popup when clicking on a station
   * @param event The station
   */
  openStationPopupOnLayerClick(event: MapLayerMouseEvent) {
    if (event.features) {
      const selectedFeature: MapboxGeoJSONFeature = event.features[0];
      let stationInformation = selectedFeature.properties;
      stationInformation.namen = JSON.parse(stationInformation.namen);
      stationInformation.synoniemen = JSON.parse(stationInformation.synoniemen);
      stationInformation.sporen = JSON.parse(stationInformation.sporen);
      stationInformation = stationInformation as StationPayload;
      selectedFeature.properties = stationInformation;
      this.selectedStationOnMapFeature = selectedFeature;
    }
  }

  /**
   * Open a train popup when clicking on a train
   * @param event The train
   */
  openTrainPopupOnLayerClick(event: MapLayerMouseEvent) {
    if (event.features) {
      const selectedFeature: MapboxGeoJSONFeature = event.features[0];
      const basicTrainInformation = selectedFeature.properties;
      basicTrainInformation.trainDetails = JSON.parse(basicTrainInformation.trainDetails);
      selectedFeature.properties = basicTrainInformation;
      this.selectedTrainOnMapFeature = selectedFeature;
    }
  }

  /**
   * Close all popups
   */
  closePopup() {
    this.selectedTrainOnMapFeature = null;
    this.selectedStationOnMapFeature = null;
  }

  /**
   * Add stations to the map with GeoJSON
   * @param stations All stations
   */
  addStationsToMap(stations: StationPayload[]) {
    console.log(stations);
    this.stationsLayerData = this.helperFunctions.parseToGeoJSON<StationPayload>(stations,
      ['lng', 'lat'], [], true);
  }

  /**
   * Add all trains to the map with GeoJSON and resume train updater
   * @param detailedTrainInformation All trains currently riding
   */
  addTrainsToMap(detailedTrainInformation: TrainInformation[]) {
    this.trainsLayerData = this.helperFunctions.parseToGeoJSON<TrainInformation>(detailedTrainInformation,
      ['lng', 'lat'], [], true);
    this.isUpdatingMapData = false;
    this.pauseOrResumeUpdatingTrainPositions(false);
    this.pauseOrResumeUpdatingTrainPositions(true);
  }

  setDisruptionMarkers() {
    this.disruptionMarkersData = [];
    console.log(this.disruptedTrainTracksLayerData.features.length);

    const uniqueDisruptions = [];
    const idMap = new Map();
    for (const feature of this.disruptedTrainTracksLayerData.features) {
      if (!idMap.has(feature.id)){
        idMap.set(feature.id, true);
        uniqueDisruptions.push(feature);
      }
    }

    uniqueDisruptions.forEach(feature => {
      const disruptionInfo = this.actualDisruptions.payload.find(disruption => disruption.id === feature.id);
      if (disruptionInfo) {
        feature.properties = disruptionInfo;
      }
      const linePart = feature.geometry.coordinates[0];
      this.disruptionMarkersData.push({
        type: 'Feature',
        properties: feature.properties,
        geometry: {
          type: 'Point',
          coordinates: linePart[Math.ceil(linePart.length / 2) - 1]
        },
      });
    });
  }

  clickMarker(evt: MapMouseEvent) {
    console.log(evt);
  }

  /**
   * Get detailed information about all train currently riding
   * Set train icons when data is received
   */
  getActiveTrainsAndDetails() {
    this.isUpdatingMapData = true;
    this.pauseOrResumeUpdatingTrainPositions(true);
    let basicTrainInformation: TrainInformation[];
    this.apiService.getBasicInformationAboutAllTrains().pipe(
      mergeMap((trains) => {
        basicTrainInformation = trains.payload.treinen;
        let trainIds = '';
        trains.payload.treinen.forEach((train) => {
          trainIds += train.ritId + ',';
        });
        return this.apiService.getTrainDetailsByRideId(trainIds);
      }),
      map(trainDetails => {
        basicTrainInformation.forEach((basicTrain) => {
          basicTrain.trainDetails = trainDetails.find(details => details.ritnummer.toString() === basicTrain.ritId);
        });
        return basicTrainInformation;
      })
    ).subscribe({
      next: detailedTrainInformation => {
        console.log(detailedTrainInformation);
        this.setTrainIconName(detailedTrainInformation);
      },
      error: err => {
        console.log(err);
      },
    });
  }

  /**
   * Add the train icon to the map for each type of train
   * Add train to map with GeoJSON if icons already have been added
   * @param detailedTrainInformation Detailed information about all trains
   */
  setTrainIconName(detailedTrainInformation: TrainInformation[]) {
    const iconURLs: Map<string, string> = new Map<string, string>();

    detailedTrainInformation.forEach((basicTrain) => {
      let imageName = 'alternative';
      let imageURL = '../../assets/alternative-train.png';

      // If train has details about material, add the image url
      if (basicTrain.trainDetails && basicTrain.trainDetails.materieeldelen) {
        const materiaaldelen = basicTrain.trainDetails.materieeldelen;
        // Get last part of url, like 'virm_4.png', to be used as a name
        const urlParts = materiaaldelen[0].afbeelding.split('/');
        imageName = urlParts[urlParts.length - 1];
        const allIconNames = Array.from(iconURLs.keys());
        // Add the url for an icon name if it has not been added
        if (allIconNames.includes(imageName) === false) {
          // if (materiaaldelen.length > 1) {
          //   console.log(basicTrain);
          // }
          const firstTrainPart = materiaaldelen[0];
          if (firstTrainPart.afbeelding) {
            imageURL = firstTrainPart.afbeelding;
          }
          if (firstTrainPart.bakken && firstTrainPart.bakken.length > 0) {
            imageURL = firstTrainPart.bakken[0].afbeelding.url;
          }
          iconURLs.set(imageName, imageURL);
        }
        // Set the icon name for this train
        basicTrain.trainIconName = imageName;
      } else {
        // If the train has no details set to alternative and add alternative-train.png
        console.log(basicTrain);
        basicTrain.trainIconName = imageName;
        iconURLs.set(imageName, imageURL);
      }
    });

    if (this.trainIconsForMap.length === 0) {
      this.getAndAddTrainIconsToMap(iconURLs, detailedTrainInformation);
    } else {
      this.addTrainsToMap(detailedTrainInformation);
    }
  }

  /**
   * Add train icons to the map
   * @param iconURLs Icon name and url
   * @param detailedTrainInformation Detailed information about all trains
   */
  getAndAddTrainIconsToMap(iconURLs: Map<string, string>, detailedTrainInformation: TrainInformation[]) {
    const jimpImageNames: string[] = [];
    const jimpBufferObservables: Observable<Buffer>[] = [];

    iconURLs.forEach((imageURL, imageName) => {
      jimpImageNames.push(imageName);
      jimpBufferObservables.push(from(Jimp.read(imageURL)).pipe(
        mergeMap<Jimp, Observable<Buffer>>(image => {
          image.resize(Jimp.AUTO, 50).crop(0, 0, 100, 50);
          if (image.hasAlpha()) {
            image.rgba(true).background(0x000000FF);
          }
          return from(image.getBufferAsync(Jimp.MIME_PNG));
        }),
        mergeMap(buffer => from<Observable<Jimp>>(replaceColor({
          image: buffer,
          colors: {
            type: 'hex',
            targetColor: '#FFFFFF',
            replaceColor: '#00000000'
          }
        }))),
        mergeMap(image => image.getBufferAsync(Jimp.MIME_PNG)),
      ));
    });

    forkJoin(jimpBufferObservables).subscribe({
      next: buffers => {
        buffers.forEach((buffer, index) => {
          this.trainIconNames.add(jimpImageNames[index]);
          this.trainIconsForMap.push({
            imageName: jimpImageNames[index],
            imageObjectURL: window.URL.createObjectURL(new Blob([buffer], {type: 'image/png'}))
          });
        });
      },
      complete: () => {
        this.listenForTrainIcons(detailedTrainInformation);
      }
    });
  }

  /**
   * Listen if all train icons have been added to the map,
   * then add the trains to the map with GeoJSON
   * @param detailedTrainInformation Detailed information about all trains
   */
  listenForTrainIcons(detailedTrainInformation: TrainInformation[]) {
    this.trainIconAdded.subscribe({
      next: trainIconName => {
        this.trainIconsAdded.add(trainIconName);
        if (this.trainIconNames.size === this.trainIconsAdded.size) {
          this.addTrainsToMap(detailedTrainInformation);
          this.trainIconAddedSource.complete();
        }
      },
      error: err => console.log(err),
      complete: () => {
        this.isUpdatingMapData = false;
      }
    });
  }

  /**
   * Fly to a station and open a station popup
   * @param station The station
   */
  flyToStation(station: StationPayload) {
    if (this.trainMap && station) {
      this.trainMap.flyTo({
        center: [station.lng, station.lat],
        zoom: 15,
      });
      this.trainMap.once('moveend', () => {
        const features = this.trainMap.queryRenderedFeatures(null, {layers: ['stations']});
        if (features.length > 0) {
          const selectedFeature: MapboxGeoJSONFeature = features[0];
          selectedFeature.properties = station;
          this.selectedStationOnMapFeature = selectedFeature;
        }
      });
    }
  }
}
