import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionMixtureAnalysisComponent } from './solution-mixture-analysis.component';

describe('SolutionMixtureAnalysisComponent', () => {
  let component: SolutionMixtureAnalysisComponent;
  let fixture: ComponentFixture<SolutionMixtureAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolutionMixtureAnalysisComponent]
    });
    fixture = TestBed.createComponent(SolutionMixtureAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
