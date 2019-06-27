import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentCalendarComponent } from './shipment-calendar.component';

describe('ShipmentCalendarComponent', () => {
  let component: ShipmentCalendarComponent;
  let fixture: ComponentFixture<ShipmentCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
