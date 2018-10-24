import { TestBed } from '@angular/core/testing';

import { RecordingListService } from './recording-list.service';

describe('RecordingListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecordingListService = TestBed.get(RecordingListService);
    expect(service).toBeTruthy();
  });
});
