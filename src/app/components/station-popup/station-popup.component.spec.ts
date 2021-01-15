import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StationPopupComponent } from './station-popup.component';

describe('StationPopupComponent', () => {
  let component: StationPopupComponent;
  let fixture: ComponentFixture<StationPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
