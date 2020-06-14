import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainPopupComponent } from './train-popup.component';

describe('TrainPopupComponent', () => {
  let component: TrainPopupComponent;
  let fixture: ComponentFixture<TrainPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
