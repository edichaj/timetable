import { TestBed } from '@angular/core/testing';

import { PopoverfactoryService } from './popoverfactory.service';

describe('PopoverfactoryService', () => {
  let service: PopoverfactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopoverfactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
