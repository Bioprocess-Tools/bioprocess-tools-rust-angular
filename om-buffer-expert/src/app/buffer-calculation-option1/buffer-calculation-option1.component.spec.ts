import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BufferCalculationOption1Component } from './buffer-calculation-option1.component';

describe('BufferCalculationOption1Component', () => {
  let component: BufferCalculationOption1Component;
  let fixture: ComponentFixture<BufferCalculationOption1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BufferCalculationOption1Component]
    });
    fixture = TestBed.createComponent(BufferCalculationOption1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
