import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainMapSidebarComponent } from './train-map-sidebar.component';

describe('TrainMapSidebarComponent', () => {
  let component: TrainMapSidebarComponent;
  let fixture: ComponentFixture<TrainMapSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainMapSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainMapSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
