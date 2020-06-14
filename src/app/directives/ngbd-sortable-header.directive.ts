import {Directive, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';
import {StationPayload} from '../models/Station';

export type SortColumn = keyof StationPayload | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: '[appNgbdSortableHeader]',
})
export class NgbdSortableHeaderDirective {
  @Input() appNgbdSortableHeader: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  @HostBinding('class.asc')
  get ascClass() {
    return this.direction === 'asc';
  }

  @HostBinding('class.desc')
  get descClass() {
    return this.direction === 'desc';
  }

  @HostListener('click') onClick() {
    this.rotate();
  }

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.appNgbdSortableHeader, direction: this.direction});
  }
}
