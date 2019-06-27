import { Component, OnInit, Input } from '@angular/core';
import { ConstantType } from '@app/core/services/constant.type';
import { RaTemplateService } from './../../modules/ra-template/service/ra-template.service';
import { ResponseService } from './../../shared/services/response-handler/response.service';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/guards/auth.service';
import { RiskAssessmentService } from './../../modules/ra/service/risk-assessment.service';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.scss']
})
export class SecureComponent implements OnInit {

  @Input() toggleMenu: Boolean = false;
  toggleSubMenus: String = '';
  toggleChildSubMenu: String = '';
  toggleChildSubMenuSelected: String = '';
  currentUser: any;
  constructor (  private raTemplateService: RaTemplateService, private router: Router,
    public responseService: ResponseService, private authService: AuthService,
    private riskAssessmentService:RiskAssessmentService) { }

  ngOnInit() {
    this.currentUser = this.authService.getPermission();
    console.log("current :", this.currentUser);
    // const toggleSubMenus = localStorage.getItem('toggleSubMenus');
    // const toggleChildSubMenu = localStorage.getItem('toggleChildSubMenu') ? localStorage.getItem('toggleChildSubMenu') : '';
    // const toggleChildSubMenuSelected = localStorage.getItem('toggleChildSubMenuSelected') ?
    //   localStorage.getItem('toggleChildSubMenuSelected') : '';
    // if ( toggleSubMenus ) {
    //   this.getToggleSubMenus(toggleSubMenus, toggleChildSubMenu, toggleChildSubMenuSelected);
    // }
  }
  checkSecurity ( parent, childKey ) {
   return this.authService.checkMenuSecurity(parent, childKey);
  }
  // getToggleSubMenus(type, childMenu = '', childSubMenu = '') {
  //   this.toggleSubMenus = type;
  //   this.toggleChildSubMenu = childMenu;
  //   this.toggleChildSubMenuSelected = childSubMenu;
  //   localStorage.setItem('toggleSubMenus', type);
  //   localStorage.setItem('toggleChildSubMenu', childMenu);
  //   localStorage.setItem('toggleChildSubMenuSelected', childSubMenu);
  // }
  parentToggleMenu(data) {
    this.toggleMenu = data;
  }
  receiveToggoleMenu(eventValue){
    this.toggleMenu = eventValue;
  }
  // userProfile(){
  //   this.router.navigate(['/secure/user/update/' + this.authService.getPermission()._id]);
  // }
  // createRATemplate() {
  //   this.raTemplateService.removeRATemplateSessionStorage();
  // }
  // createRiskAssessment(){
  //   this.riskAssessmentService.removeRiskAssessmentSessionStorage();
  // }
}
