import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperCalculatorComponent } from './super-calculator.component';

describe('SuperCalculatorComponent', () => {
  let component: SuperCalculatorComponent;
  let fixture: ComponentFixture<SuperCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuperCalculatorComponent]
    });
    fixture = TestBed.createComponent(SuperCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
