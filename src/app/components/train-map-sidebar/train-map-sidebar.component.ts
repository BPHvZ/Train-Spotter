import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition, animateChild, query, group,
} from '@angular/animations';
import {DisruptionPayload} from '../../models/Disruption';

@Component({
  selector: 'app-train-map-sidebar',
  templateUrl: './train-map-sidebar.component.html',
  styleUrls: ['./train-map-sidebar.component.sass'],
  animations: [
    trigger('openClose', [
      state('open', style({
        transform: 'scaleX(1)'
      })),
      state('closed', style({
        transform: 'scaleX(0)'
      })),
      transition('open => closed', [
        group([
          query('@openClose-content', animateChild()),
          animate('0.5s cubic-bezier(0.55, 0.31, 0.15, 0.93)')
        ]),
      ]),
      transition('* => open', [
        group([
          query('@openClose-content', animateChild()),
          animate('0.5s cubic-bezier(0.55, 0.31, 0.15, 0.93)'),
        ]),
      ]),
    ]),
    trigger('openClose-content', [
      state('open', style({
        opacity: 1
      })),
      state('closed', style({
        opacity: 0
      })),
      transition('open => closed', [
        animate('0.3s cubic-bezier(0.55, 0.31, 0.15, 0.93)')
      ]),
      transition('* => open', [
        animate('0.7s cubic-bezier(0.55, 0.31, 0.15, 0.93)'),
      ]),
    ]),
  ]
})
export class TrainMapSidebarComponent implements OnInit {
  @Input() isOpen = false;
  @Input() disruptions: DisruptionPayload[];
  @Output() closeSidebar = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  done(event) {
    if (event.toState === 'closed') {
      this.closeSidebar.emit(null);
    }
  }

}
