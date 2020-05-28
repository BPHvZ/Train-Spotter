import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HttpClientService} from './http-client.service';
import { environment } from '../../environments/environment';
import {Station} from '../models/Station';
import {TrainTrackGeoJSON} from '../models/TrainTrackGeoJSON';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClientService) { }

  getBasicInformationAboutAllStations(): Observable<Station> {
    return this.http.get({
      url: 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations',
      cacheMins: 30,
      headers: {
        'Ocp-Apim-Subscription-Key': environment.NS_Ocp_Apim_Subscription_Key
      }
    });
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
      cacheMins: 2,
      headers: {
        'Ocp-Apim-Subscription-Key': environment.NS_Ocp_Apim_Subscription_Key
      }
    });
  }
}
