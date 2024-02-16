import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionMixtureStepsComponent } from './solution-mixture-steps.component';

describe('SolutionMixtureStepsComponent', () => {
  let component: SolutionMixtureStepsComponent;
  let fixture: ComponentFixture<SolutionMixtureStepsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolutionMixtureStepsComponent]
    });
    fixture = TestBed.createComponent(SolutionMixtureStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
