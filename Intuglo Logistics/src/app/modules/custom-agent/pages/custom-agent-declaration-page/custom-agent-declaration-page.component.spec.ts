import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAgentDeclarationPageComponent } from './custom-agent-declaration-page.component';

describe('CustomAgentDeclarationPageComponent', () => {
  let component: CustomAgentDeclarationPageComponent;
  let fixture: ComponentFixture<CustomAgentDeclarationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAgentDeclarationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAgentDeclarationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
