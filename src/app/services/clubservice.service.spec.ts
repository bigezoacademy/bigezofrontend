import { TestBed } from '@angular/core/testing';

import { ClubserviceService } from './clubservice.service';

describe('ClubserviceService', () => {
  let service: ClubserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClubserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
