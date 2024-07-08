import { TestBed } from '@angular/core/testing';

import { OmRustWASMService } from './om-rust-wasm.service';

describe('OmRustWASMService', () => {
  let service: OmRustWASMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OmRustWASMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
