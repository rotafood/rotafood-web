import { TestBed } from '@angular/core/testing';

import { ShowDashSideNavService } from './show-dash-side-nav.service';

describe('ShowDashSideNavService', () => {
  let service: ShowDashSideNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowDashSideNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
