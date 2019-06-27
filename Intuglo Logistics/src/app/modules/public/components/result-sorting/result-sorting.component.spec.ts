import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSortingComponent } from './result-sorting.component';

describe('ResultSortingComponent', () => {
  let component: ResultSortingComponent;
  let fixture: ComponentFixture<ResultSortingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultSortingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
