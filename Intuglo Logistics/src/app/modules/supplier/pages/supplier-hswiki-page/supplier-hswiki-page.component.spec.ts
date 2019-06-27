import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierHswikiPageComponent } from './supplier-hswiki-page.component';

describe('SupplierHswikiPageComponent', () => {
  let component: SupplierHswikiPageComponent;
  let fixture: ComponentFixture<SupplierHswikiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierHswikiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierHswikiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
