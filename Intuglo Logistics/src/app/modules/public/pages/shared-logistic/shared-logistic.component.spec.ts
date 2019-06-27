import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLogisticComponent } from './shared-logistic.component';

describe('SharedLogisticComponent', () => {
  let component: SharedLogisticComponent;
  let fixture: ComponentFixture<SharedLogisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedLogisticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLogisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
