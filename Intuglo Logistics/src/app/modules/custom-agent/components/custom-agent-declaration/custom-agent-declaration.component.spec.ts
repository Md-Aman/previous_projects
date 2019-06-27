import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAgentDeclarationComponent } from './custom-agent-declaration.component';

describe('CustomAgentDeclarationComponent', () => {
  let component: CustomAgentDeclarationComponent;
  let fixture: ComponentFixture<CustomAgentDeclarationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAgentDeclarationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAgentDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
