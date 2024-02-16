import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionsReviewComponent } from './solutions-review.component';

describe('SolutionsReviewComponent', () => {
  let component: SolutionsReviewComponent;
  let fixture: ComponentFixture<SolutionsReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolutionsReviewComponent]
    });
    fixture = TestBed.createComponent(SolutionsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
