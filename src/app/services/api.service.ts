import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {HttpClientService} from './http-client.service';
import {environment} from '../../environments/environment';
import {Station, StationPayload} from '../models/Station';
import {TrainTrackGeoJSON} from '../models/TrainTrackGeoJSON';
import {BasicTrain} from '../models/BasicTrain';
import {TrainDetails} from '../models/TrainDetails';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClientService) {
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

  searchForStation(term: string): Observable<StationPayload[]> {
    if (term === '') {
      return of([]);
    }

    return this.http.get<Station>({
      url: 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations',
      cacheMins: 60,
      headers: {
        'Ocp-Apim-Subscription-Key': environment.NS_Ocp_Apim_Subscription_Key
      }
    }).pipe(
      map(response => response.payload.filter(
        station => station.namen.lang.toUpperCase().includes(term.toUpperCase()) ||
          station.code.toUpperCase().includes(term.toUpperCase())
        )
      )
    );
  }

  getTrainTracksGeoJSON(): Observable<TrainTrackGeoJSON> {
    return this.http.get({
      url: 'https://gateway.apiportal.ns.nl/Spoorkaart-API/api/v1/spoorkaart',
      cacheMins: 60,
      headers: {
        'Ocp-Apim-Subscription-Key': environment.NS_Ocp_Apim_Subscription_Key
      }
    });
  }

  getDisruptedTrainTracksGeoJSON(): Observable<TrainTrackGeoJSON> {
    return this.http.get({
      url: 'https://gateway.apiportal.ns.nl/Spoorkaart-API/api/v1/storingen',
      cacheMins: 60,
      headers: {
        'Ocp-Apim-Subscription-Key': environment.NS_Ocp_Apim_Subscription_Key
      }
    });
  }

  getBasicInformationAboutAllTrains(): Observable<BasicTrain> {
    return this.http.get({
      url: 'https://gateway.apiportal.ns.nl/virtual-train-api/api/vehicle',
      cacheMins: 60,
      headers: {
        'Ocp-Apim-Subscription-Key': environment.NS_Ocp_Apim_Subscription_Key
      }
    });
  }

  getTrainDetailsByRideId(rideIds: string): Observable<TrainDetails[]> {
    const trainParams = new HttpParams()
      .set('ids', rideIds)
      .set('all', 'false');
    return this.http.get({
      url: 'https://gateway.apiportal.ns.nl/virtual-train-api/api/v1/trein',
      cacheMins: 60,
      headers: {
        'Ocp-Apim-Subscription-Key': environment.NS_Ocp_Apim_Subscription_Key
      },
      params: trainParams
    });
  }
}
