import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignQuestionModalComponent } from './assign-question-modal.component';

describe('AssignQuestionModalComponent', () => {
  let component: AssignQuestionModalComponent;
  let fixture: ComponentFixture<AssignQuestionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignQuestionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignQuestionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
