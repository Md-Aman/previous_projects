import { Router } from '@angular/router';
import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'customer-left-menu',
  templateUrl: './customer-left-menu.component.html',
  styleUrls: ['./customer-left-menu.component.css']
})
export class CustomerLeftMenuComponent implements OnInit {

  @Input() sideBar: boolean;
  @Input() fromDashboard: boolean;
  @Input() fromCart: boolean;
  @Input() fromHSwiki: boolean;
  @Input() fromPayment: boolean;
  
  step;
  stepOne: boolean;
  stepTwo: boolean;
  stepTwoOne: boolean;
  stepThree: boolean;
  stepFour: boolean;
  stepFive: boolean;
  stepSix: boolean;
  stepSixOne: boolean;
  stepSixTwo: boolean;
  stepSeven: boolean;
  stepSevenOne: boolean;
  stepSevenTwo: boolean;
  
  constructor(private router: Router) {
  }

  ngOnInit() {
 
    
  }


  menuOrder() {
    this.stepOne = true;
    this.stepTwo = false;
    this.stepTwoOne = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
    this.stepSix = false;
    this.stepSixOne = false;
    this.stepSixTwo = false;
    this.stepSeven = false;
    this.stepSevenOne = false;
    this.stepSevenTwo = false;
    this.router.navigateByUrl("/customer/dashboard");
  }

  menuPayment() {
    this.stepTwo = true;
    this.stepTwoOne = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
    this.stepSix = false;
    this.stepSixOne = false;
    this.stepSixTwo = false;
    this.stepSeven = false;
    this.stepSevenOne = false;
    this.stepSevenTwo = false;
    this.stepOne = false;
    // this.router.navigateByUrl("");
  }

  menuCart() {
    this.stepTwoOne = true;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
    this.stepSix = false;
    this.stepSixOne = false;
    this.stepSixTwo = false;
    this.stepSeven = false;
    this.stepSevenOne = false;
    this.stepSevenTwo = false;
    this.stepOne = false;
    this.stepTwo = false;
    this.router.navigateByUrl("/customer/cart");
  }

  menuWiki() {
    this.stepThree = true;
    this.stepFour = false;
    this.stepFive = false;
    this.stepSix = false;
    this.stepSixOne = false;
    this.stepSixTwo = false;
    this.stepSeven = false;
    this.stepSevenOne = false;
    this.stepSevenTwo = false;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepTwoOne = false;
    this.router.navigateByUrl("/customer/hswiki");
  } 
  
  menuLiveChat() {
    this.stepFour = true;
    this.stepFive = false;
    this.stepSix = false;
    this.stepSixOne = false;
    this.stepSixTwo = false;
    this.stepSeven = false;
    this.stepSevenOne = false;
    this.stepSevenTwo = false;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepTwoOne = false;
    this.stepThree = false;
    // this.router.navigateByUrl("");
  } 

  menuTicket() {
    this.stepFive = true;
    this.stepSix = false;
    this.stepSixOne = false;
    this.stepSixTwo = false;
    this.stepSeven = false;
    this.stepSevenOne = false;
    this.stepSevenTwo = false;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepTwoOne = false;
    this.stepThree = false;
    this.stepFour = false;
    // this.router.navigateByUrl("");
  }

  menuBooking() {
    this.stepSix = true;
    this.stepSixOne = false;
    this.stepSixTwo = false;
    this.stepSeven = false;
    this.stepSevenOne = false;
    this.stepSevenTwo = false;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepTwoOne = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
    // this.router.navigateByUrl("");
  } 

  menuSummary() {
    this.stepSixOne = true;
    this.stepSixTwo = false;
    this.stepSeven = false;
    this.stepSevenOne = false;
    this.stepSevenTwo = false;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepTwoOne = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
    this.stepSix = false;
    // this.router.navigateByUrl("");
  } 

  menuBookingForm() {
    this.stepSixTwo = true;
    this.stepSeven = false;
    this.stepSevenOne = false;
    this.stepSevenTwo = false;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepTwoOne = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
    this.stepSix = false;
    this.stepSixOne = false;
    // this.router.navigateByUrl("");
  } 

  menuPaymentReport() {
    this.stepSeven = true;
    this.stepSevenOne = false;
    this.stepSevenTwo = false;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepTwoOne = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
    this.stepSix = false;
    this.stepSixOne = false;
    this.stepSixTwo = false;
    // this.router.navigateByUrl("");
  }

  menuInvoice() {
    this.stepSevenOne = true;
    this.stepSevenTwo = false;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepTwoOne = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
    this.stepSix = false;
    this.stepSixOne = false;
    this.stepSixTwo = false;
    this.stepSeven = false;
    // this.router.navigateByUrl("/customer/invoices");
  }

  menuReceipt() {
    this.stepSevenTwo = true;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepTwoOne = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
    this.stepSix = false;
    this.stepSixOne = false;
    this.stepSixTwo = false;
    this.stepSeven = false;
    this.stepSevenOne = false;
    // this.router.navigateByUrl("");
  }



}
