import { TestBed } from '@angular/core/testing';

import { StationsService } from './stations.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('StationsService', () => {
  let service: StationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(StationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
