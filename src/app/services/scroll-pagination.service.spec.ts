import { TestBed } from '@angular/core/testing';

import { ScrollPaginationService } from './scroll-pagination.service';

describe('ScrollPaginationService', () => {
  let service: ScrollPaginationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollPaginationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
