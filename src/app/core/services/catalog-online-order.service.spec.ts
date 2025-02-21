import { TestBed } from '@angular/core/testing';

import { CatalogOnlineOrderService } from './catalog-online-order.service';

describe('CatalogOnlineOrderService', () => {
  let service: CatalogOnlineOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogOnlineOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
