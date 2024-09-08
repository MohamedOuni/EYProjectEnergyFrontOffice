import { TestBed } from '@angular/core/testing';

import { ClientResponsesService } from './client-responses.service';

describe('ClientResponsesService', () => {
  let service: ClientResponsesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientResponsesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
