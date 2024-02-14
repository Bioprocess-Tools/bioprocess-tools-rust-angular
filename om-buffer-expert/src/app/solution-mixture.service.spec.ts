import { TestBed } from '@angular/core/testing';

import { SolutionMixtureService } from './solution-mixture.service';

describe('SolutionMixtureService', () => {
  let service: SolutionMixtureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolutionMixtureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
