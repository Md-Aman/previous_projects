import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ConstantType } from './../../services/constant.type';
import { RaTemplateService } from './../../../modules/ra-template/service/ra-template.service';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { Router } from '@angular/router';
import { AuthService } from './../../guards/auth.service';
import { RiskAssessmentService } from './../../../modules/ra/service/risk-assessment.service';

@Component({
  selector: 'rpstaff',
  templateUrl: './rpstaff.component.html',
  styleUrls: ['./rpstaff.component.scss']
})
export class RpstaffComponent implements OnInit {
  @Output() emitEvent: EventEmitter<Object> = new EventEmitter();
  toggleMenu: Boolean = false;
  toggleSubMenus: String = '';
  toggleChildSubMenu: String = '';
  toggleChildSubMenuSelected: String = '';
  currentUser: any;
  constructor (  private raTemplateService: RaTemplateService, private router: Router,
    public responseService: ResponseService, private authService: AuthService,
    private riskAssessmentService:RiskAssessmentService) { }

  ngOnInit() {
    this.currentUser = this.authService.getPermission();
    const toggleSubMenus = localStorage.getItem('toggleSubMenus');
    const toggleChildSubMenu = localStorage.getItem('toggleChildSubMenu') ? localStorage.getItem('toggleChildSubMenu') : '';
    const toggleChildSubMenuSelected = localStorage.getItem('toggleChildSubMenuSelected') ?
      localStorage.getItem('toggleChildSubMenuSelected') : '';
    if ( toggleSubMenus ) {
      this.getToggleSubMenus(toggleSubMenus, toggleChildSubMenu, toggleChildSubMenuSelected);
    }
  }
  checkSecurity ( parent, childKey ) {
   return this.authService.checkMenuSecurity(parent, childKey);
  }
  getToggleSubMenus(type, childMenu = '', childSubMenu = '') {
    this.toggleSubMenus = type;
    this.toggleChildSubMenu = childMenu;
    this.toggleChildSubMenuSelected = childSubMenu;
    localStorage.setItem('toggleSubMenus', type);
    localStorage.setItem('toggleChildSubMenu', childMenu);
    localStorage.setItem('toggleChildSubMenuSelected', childSubMenu);
  }
  parentToggleMenu(data) {
    this.toggleMenu = data;
    this.emitEvent.emit(this.toggleMenu);
  }
  createRATemplate() {
    this.raTemplateService.removeRATemplateSessionStorage();
  }
  createRiskAssessment(){
    this.riskAssessmentService.removeRiskAssessmentSessionStorage();
  }
  createSupplier(){
    this.router.navigate(['/secure/supplier/list'],{ queryParams: { create: true}});
  }
}
