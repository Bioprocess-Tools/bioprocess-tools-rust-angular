import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionsBrowseEditPrepareComponent } from './solutions-browse-edit-prepare.component';

describe('SolutionsBrowseEditPrepareComponent', () => {
  let component: SolutionsBrowseEditPrepareComponent;
  let fixture: ComponentFixture<SolutionsBrowseEditPrepareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolutionsBrowseEditPrepareComponent]
    });
    fixture = TestBed.createComponent(SolutionsBrowseEditPrepareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
