import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAgentCountryFilterComponent } from './custom-agent-country-filter.component';

describe('CustomAgentCountryFilterComponent', () => {
  let component: CustomAgentCountryFilterComponent;
  let fixture: ComponentFixture<CustomAgentCountryFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAgentCountryFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAgentCountryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
