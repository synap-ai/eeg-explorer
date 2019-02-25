import { TestBed } from '@angular/core/testing';

import { FilePlayerService } from './file-player.service';

describe('FilePlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilePlayerService = TestBed.get(FilePlayerService);
    expect(service).toBeTruthy();
  });
});
