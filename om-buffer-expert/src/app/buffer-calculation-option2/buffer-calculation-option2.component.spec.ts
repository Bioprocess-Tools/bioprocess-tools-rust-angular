import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BufferCalculationOption2Component } from './buffer-calculation-option2.component';

describe('BufferCalculationOption2Component', () => {
  let component: BufferCalculationOption2Component;
  let fixture: ComponentFixture<BufferCalculationOption2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BufferCalculationOption2Component]
    });
    fixture = TestBed.createComponent(BufferCalculationOption2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
