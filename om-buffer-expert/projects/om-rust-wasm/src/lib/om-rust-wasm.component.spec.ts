import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OmRustWASMComponent } from './om-rust-wasm.component';

describe('OmRustWASMComponent', () => {
  let component: OmRustWASMComponent;
  let fixture: ComponentFixture<OmRustWASMComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OmRustWASMComponent]
    });
    fixture = TestBed.createComponent(OmRustWASMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
