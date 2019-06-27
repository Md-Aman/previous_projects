import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCreateListModalComponent } from './supplier-create-list-modal.component';

describe('SupplierCreateListModalComponent', () => {
  let component: SupplierCreateListModalComponent;
  let fixture: ComponentFixture<SupplierCreateListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCreateListModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCreateListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
