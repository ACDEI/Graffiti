import { TestBed } from '@angular/core/testing';

import { AuxiliarUserService } from './auxiliar-user.service';

describe('AuxiliarUserService', () => {
  let service: AuxiliarUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuxiliarUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
