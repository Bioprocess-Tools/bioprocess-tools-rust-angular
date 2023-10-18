import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionTableComponent } from './solution-table.component';

describe('SolutionTableComponent', () => {
  let component: SolutionTableComponent;
  let fixture: ComponentFixture<SolutionTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolutionTableComponent]
    });
    fixture = TestBed.createComponent(SolutionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
