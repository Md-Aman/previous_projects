import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerHswikiListComponent } from './customer-hswiki-list.component';

describe('CustomerHswikiListComponent', () => {
  let component: CustomerHswikiListComponent;
  let fixture: ComponentFixture<CustomerHswikiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerHswikiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerHswikiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
