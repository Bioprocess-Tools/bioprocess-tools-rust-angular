import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BufferDesignerComponent } from './buffer-designer.component';

describe('BufferDesignerComponent', () => {
  let component: BufferDesignerComponent;
  let fixture: ComponentFixture<BufferDesignerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BufferDesignerComponent]
    });
    fixture = TestBed.createComponent(BufferDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
