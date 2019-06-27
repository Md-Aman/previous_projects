import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcForHireComponent } from './qc-for-hire.component';

describe('QcForHireComponent', () => {
  let component: QcForHireComponent;
  let fixture: ComponentFixture<QcForHireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcForHireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcForHireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
