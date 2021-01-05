import { TestBed } from '@angular/core/testing';

import { ScrollPaginationPublicationsService } from './scroll-pagination-publications.service';

describe('ScrollPaginationPublicationsService', () => {
  let service: ScrollPaginationPublicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollPaginationPublicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
