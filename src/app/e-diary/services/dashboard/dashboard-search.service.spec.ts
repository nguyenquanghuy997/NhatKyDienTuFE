import { TestBed } from '@angular/core/testing';

import { DashboardSearchService } from './dashboard-search.service';

describe('DashboardSearchService', () => {
  let service: DashboardSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
