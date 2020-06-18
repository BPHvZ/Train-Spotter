import {Component, Input, Output, OnChanges, OnInit, SimpleChanges, EventEmitter, OnDestroy} from '@angular/core';
import {TrainInformation} from '../../models/BasicTrain';
import {MapboxGeoJSONFeature} from 'mapbox-gl';

@Component({
  selector: 'app-train-popup',
  templateUrl: './train-popup.component.html',
  styleUrls: ['./train-popup.component.sass']
})
export class TrainPopupComponent implements OnInit, OnChanges {
  @Output() public onClose: EventEmitter<any> = new EventEmitter();
  @Input() mapboxFeature: MapboxGeoJSONFeature;
  trainDetails: TrainInformation;
  directionArrowStyle: Map<string, any> = new Map<string, any>();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.mapboxFeature.currentValue) {
      this.trainDetails = this.mapboxFeature.properties as TrainInformation;
      this.directionArrowStyle.set('transform', `rotate(${this.trainDetails.richting - 90}deg)`);
    }
  }

  getTypeOfTrain(): string {
    const type = this.trainDetails.type;
    if (type === 'SPR') {
      return 'Sprinter';
    } else if (type === 'IC') {
      return 'Intercity';
    } else {
      return type;
    }
  }
}
