import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffillatesAndPartnersComponent } from './affillates-and-partners.component';

describe('AffillatesAndPartnersComponent', () => {
  let component: AffillatesAndPartnersComponent;
  let fixture: ComponentFixture<AffillatesAndPartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffillatesAndPartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffillatesAndPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
