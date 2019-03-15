import { TestBed } from '@angular/core/testing';

import { EegStreamService } from './eeg-stream.service';

describe('EegStreamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EegStreamService = TestBed.get(EegStreamService);
    expect(service).toBeTruthy();
  });
});
