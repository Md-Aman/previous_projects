import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultPaginationComponent } from './result-pagination.component';

describe('ResultPaginationComponent', () => {
  let component: ResultPaginationComponent;
  let fixture: ComponentFixture<ResultPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
