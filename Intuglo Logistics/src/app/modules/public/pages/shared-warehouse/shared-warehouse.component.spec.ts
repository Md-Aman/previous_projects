import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedWarehouseComponent } from './shared-warehouse.component';

describe('SharedWarehouseComponent', () => {
  let component: SharedWarehouseComponent;
  let fixture: ComponentFixture<SharedWarehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedWarehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
