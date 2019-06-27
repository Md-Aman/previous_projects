import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualItemHistoryComponent } from './individual-item-history.component';

describe('IndividualItemHistoryComponent', () => {
  let component: IndividualItemHistoryComponent;
  let fixture: ComponentFixture<IndividualItemHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualItemHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualItemHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
