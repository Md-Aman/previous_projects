import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEmployeeReportComponent } from './admin-employee-report.component';

describe('AdminEmployeeReportComponent', () => {
  let component: AdminEmployeeReportComponent;
  let fixture: ComponentFixture<AdminEmployeeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEmployeeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEmployeeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
