import { TestBed } from '@angular/core/testing';

import { CompanyDataStorageService } from './company-data-storage.service';

describe('CompanyDataStorageService', () => {
  let service: CompanyDataStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyDataStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
