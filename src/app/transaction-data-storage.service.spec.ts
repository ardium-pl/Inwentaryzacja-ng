import {TestBed} from '@angular/core/testing';

import {TransactionDataStorageService} from './transaction-data-storage.service';

/**
 * Test Suite for TransactionDataStorageService
 *
 * This suite contains unit tests for the TransactionDataStorageService.
 * The service is provided and injected before each test.
 * The suite contains a single test to verify that the service is created successfully.
 */
describe('TransactionDataStorageService', () => {
  let service: TransactionDataStorageService;

  /**
   * Before each test, the TestBed is configured with no providers.
   * The TransactionDataStorageService is then injected into the 'service' variable.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionDataStorageService);
  });

  /**
   * Test Case: Service Creation
   *
   * This test verifies that the TransactionDataStorageService is created successfully.
   * The 'toBeTruthy' assertion is used to check that the 'service' variable is defined and not null.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
