import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerHswikiPageComponent } from './customer-hswiki-page.component';

describe('CustomerHswikiPageComponent', () => {
  let component: CustomerHswikiPageComponent;
  let fixture: ComponentFixture<CustomerHswikiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerHswikiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerHswikiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
