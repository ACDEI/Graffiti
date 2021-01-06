import { TestBed } from '@angular/core/testing';

import { ScrollPaginationUsersSearchService } from './scroll-pagination-users-search.service';

describe('ScrollPaginationUsersSearchService', () => {
  let service: ScrollPaginationUsersSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollPaginationUsersSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
