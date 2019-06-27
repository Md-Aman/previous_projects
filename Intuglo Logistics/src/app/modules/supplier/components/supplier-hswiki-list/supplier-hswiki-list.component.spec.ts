import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierHswikiListComponent } from './supplier-hswiki-list.component';

describe('SupplierHswikiListComponent', () => {
  let component: SupplierHswikiListComponent;
  let fixture: ComponentFixture<SupplierHswikiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierHswikiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierHswikiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
