import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-left-menu',
  templateUrl: './admin-left-menu.component.html',
  styleUrls: ['./admin-left-menu.component.css']
})
export class AdminLeftMenuComponent implements OnInit {

  @Input() sideBar: boolean;
  @Input() fromEmployeeReport: boolean;
  @Input() fromDashboard: boolean;
  @Input() fromPaymentReport: boolean;
  @Input() fromQM: boolean;
  @Input() fromUM: boolean;

  step;
  stepOne: boolean;
  stepTwo: boolean;
  stepThree: boolean;
  stepFour: boolean;
  stepFive: boolean;
  stepSix: boolean;

  constructor(private router: Router) { }

  menuOrder() {
    this.stepOne = true;
    this.stepTwo = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
    this.stepSix = false;
    this.router.navigateByUrl("/admin/dashboard");  
  }

  menuUser(){
    this.stepTwo = true;
    this.stepOne = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
    this.stepSix = false;
    this.router.navigateByUrl("/admin/user");  
  }

  menuQuotation(){
    this.stepThree = true;
    this.stepTwo = false;
    this.stepOne = false;
    this.stepFour = false;
    this.stepFive = false;
    this.stepSix = false;
    this.router.navigateByUrl("/admin/quotation");
  }
  
  menuCustom() {
    this.stepFour = true;
    this.stepThree = false;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepFive = false;
    this.stepSix = false;
    this.router.navigateByUrl("/admin/custom"); 
  }

   menuEmployeeReport() {
     this.stepFive = true;
     this.stepFour = false;
     this.stepThree = false;
     this.stepOne = false;
     this.stepTwo = false;
     this.stepSix = false;
     this.router.navigateByUrl("/admin/employee-report"); 
   }

   menuPaymentReport() {
     this.stepSix = true;
     this.stepFour = false;
     this.stepThree = false;
     this.stepOne = false;
     this.stepTwo = false;
     this.stepFive = false;
     this.router.navigateByUrl("/admin/payment-report"); 
   }

  ngOnInit() {
  }

}
