import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbufferomComponent } from './chatbufferom.component';

describe('ChatbufferomComponent', () => {
  let component: ChatbufferomComponent;
  let fixture: ComponentFixture<ChatbufferomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatbufferomComponent]
    });
    fixture = TestBed.createComponent(ChatbufferomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
