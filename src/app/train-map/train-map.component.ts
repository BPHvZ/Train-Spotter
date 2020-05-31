import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainMapType} from '../models/train-map-type';
import {combineLatest, forkJoin, from, interval, observable, Observable, of, PartialObserver, Subject, zip} from 'rxjs';
import {combineAll, every, finalize, flatMap, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {pausable, PausableObservable} from 'rxjs-pausable';
import {ApiService} from '../services/api.service';
import {StationPayload} from '../models/Station';
import {HelperFunctionsService} from '../services/helper-functions.service';
import {GeoJSON} from 'geojson';
import {environment} from '../../environments/environment';
import {BasicTrainPayload, TrainIconOnMap} from '../models/BasicTrain';
import {TrainDetials} from '../models/TrainDetails';
import * as Jimp from 'jimp';
const replaceColor = require('replace-color');

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

  stationsLayerData: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
  trainTracksLayerData: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
  disruptedTrainTracksLayerData: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
  trainsLayerData: GeoJSON.FeatureCollection<GeoJSON.Geometry>;

  private trainIconAddedSource = new Subject<string>();
  trainIconAdded = this.trainIconAddedSource.asObservable();
  private trainIconNames: Set<string> = new Set<string>();
  private trainIconsAdded: Set<string> = new Set<string>();
  trainIconsForMap: TrainIconOnMap[] = [];

  updateTrainsTimer: PausableObservable<number>;
  timerObserver: PartialObserver<number>;

  constructor(
    private apiService: ApiService,
    private helperFunctions: HelperFunctionsService,
  ) {
  }

  /**
   * Set {@link updateTrainsTimer} and {@link progressNum}
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
  }

  /**
   * get the progress used by the progress indicator
   */
  get getProgress() {
    return `${this.progressNum}%`;
  }

  onIconLoad(trainIconName) {
    this.trainIconAddedSource.next(trainIconName);
  }

  /**
   * pause or resume the {@link updateTrainsTimer}
   */
  pauseOrResumeUpdatingTrainPositions(pause: boolean) {
    if (pause === false) {
      this.updateTrainsTimer.resume();
      this.updateTrainsIsPaused = false;
    } else {
      this.updateTrainsTimer.pause();
      this.updateTrainsIsPaused = true;
    }
  }

  /**
   * Function that's fired when the map is done loading
   * @param $event information about the map on load
   */
  onMapLoad($event) {
    this.isUpdatingMapData = true;
    zip(
      this.apiService.getBasicInformationAboutAllStations(),
      this.apiService.getTrainTracksGeoJSON(),
      this.apiService.getDisruptedTrainTracksGeoJSON(),
    ).subscribe({
      next: value => {
        console.log(value);
        this.addStationsToMap(value[0].payload);
        this.trainTracksLayerData = value[1].payload;
        this.disruptedTrainTracksLayerData = value[2].payload;
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        this.getActiveTrainsAndDetails();
      }
    });
  }

  addStationsToMap(stations: StationPayload[]) {
    this.stationsLayerData = this.helperFunctions.parseToGeoJSON(stations, ['lng', 'lat'], ['code', 'namen']);
  }

  addTrainsToMap(detailedTrainInformation: BasicTrainPayload[]) {
    this.trainsLayerData = this.helperFunctions.parseToGeoJSON(detailedTrainInformation,
      ['lng', 'lat'], ['trainIconName']);
    this.isUpdatingMapData = false;
    this.pauseOrResumeUpdatingTrainPositions(false);
  }

  getActiveTrainsAndDetails() {
    this.isUpdatingMapData = true;
    this.pauseOrResumeUpdatingTrainPositions(true);
    let basicTrainInformation: BasicTrainPayload[];
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

  setTrainIconName(detailedTrainInformation: BasicTrainPayload[]) {
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

  getAndAddTrainIconsToMap(iconURLs: Map<string, string>, detailedTrainInformation: BasicTrainPayload[]) {
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
            imageObjectURL: window.URL.createObjectURL(new Blob([buffer], { type: 'image/png' }))
          });
        });
      },
      complete: () => {
        this.listenForTrainIcons(detailedTrainInformation);
      }
    });
  }

  listenForTrainIcons(detailedTrainInformation: BasicTrainPayload[]) {
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
}

