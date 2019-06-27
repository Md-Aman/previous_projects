import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAssignContainerComponent } from './supplier-assign-container.component';

describe('SupplierAssignContainerComponent', () => {
  let component: SupplierAssignContainerComponent;
  let fixture: ComponentFixture<SupplierAssignContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierAssignContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierAssignContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
