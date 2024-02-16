import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionMixtureMainComponent } from './solution-mixture-main.component';

describe('SolutionMixtureMainComponent', () => {
  let component: SolutionMixtureMainComponent;
  let fixture: ComponentFixture<SolutionMixtureMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolutionMixtureMainComponent]
    });
    fixture = TestBed.createComponent(SolutionMixtureMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
