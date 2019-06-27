import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'supplier-left-menu',
  templateUrl: './supplier-left-menu.component.html',
  styleUrls: ['./supplier-left-menu.component.css']
})
export class SupplierLeftMenuComponent implements OnInit {
  
  @Input() sideBar: boolean;
  @Input() fromDashboard: boolean;
  @Input() fromHSwiki: boolean;
  @Input() fromNQ: boolean;
  @Input() fromQuotation: boolean;
  @Input() fromPayments: boolean;
  @Input() fromModifyQuotation: boolean;
  @Input() fromViewQuotation: boolean;

  step;
  stepOne: boolean = false;
  stepTwo: boolean = false;
  stepTwoOne: boolean = false;
  stepThree: boolean = false;
  stepFour: boolean = false;
  stepFive: boolean = false;
  stepSix: boolean = false;
  stepSixOne: boolean = false;
  stepSixTwo: boolean = false;
  stepSeven: boolean = false;
  stepSevenOne: boolean = false;
  stepEight: boolean = false;
  stepEightOne: boolean = false;

  constructor(private router: Router) { }

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
    this.stepEight = false;
    this.stepEightOne = false;
    this.router.navigateByUrl("/supplier/dashboard");    
  }

  menuQuotation() {
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
    this.stepEight = false;
    this.stepEightOne = false;
    this.stepOne = false;
    this.router.navigateByUrl("/supplier/quotation");  
  }

  menuNewQuotation() {
    this.stepTwoOne = true;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
    this.stepSix = false;
    this.stepSixOne = false;
    this.stepSixTwo = false;
    this.stepSeven = false;
    this.stepSevenOne = false;
    this.stepEight = false;
    this.stepEightOne = false;
    this.stepOne = false;
    this.stepTwo = false;
    this.router.navigateByUrl("/supplier/newquotation");
  }

  menuWiki(){
    this.stepThree = true;
    this.stepFour = false;
    this.stepFive = false;
    this.stepSix = false;
    this.stepSixOne = false;
    this.stepSixTwo = false;
    this.stepSeven = false;
    this.stepSevenOne = false;
    this.stepEight = false;
    this.stepEightOne = false;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepTwoOne = false;
    this.router.navigateByUrl("/supplier/hswiki");
  }
  
  menuLiveChat() {
    this.stepFour = true;
    this.stepFive = false;
    this.stepSix = false;
    this.stepSixOne = false;
    this.stepSixTwo = false;
    this.stepSeven = false;
    this.stepSevenOne = false;
    this.stepEight = false;
    this.stepEightOne = false;
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
    this.stepEight = false;
    this.stepEightOne = false;
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
    this.stepEight = false;
    this.stepEightOne = false;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepTwoOne = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
    // this.router.navigateByUrl("");  
  }

  menuTransactionReport() {
    this.stepSixOne = true;
    this.stepSixTwo = false;
    this.stepSeven = false;
    this.stepSevenOne = false;
    this.stepEight = false;
    this.stepEightOne = false;
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
    this.stepEight = false;
    this.stepEightOne = false;
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

  menuPayment() {
    this.stepSeven = true;
    this.stepSevenOne = false;
    this.stepEight = false;
    this.stepEightOne = false;
    this.stepOne = false;
    this.stepTwo = false;
    this.stepTwoOne = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
    this.stepSix = false;
    this.stepSixOne = false;
    this.stepSixTwo = false;
    this.router.navigateByUrl("/supplier/payment");  
  }

  menuPaymentList() {
    this.stepSevenOne = true;
    this.stepEight = false;
    this.stepEightOne = false;
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
    this.router.navigateByUrl("/supplier/payment");  
  }

  menuCargo() {
    this.stepEight = true;
    this.stepEightOne = false;
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
  
  menuPackingList() {
    this.stepEightOne = true;
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
    this.stepEight = false;
    // this.router.navigateByUrl("");  
  }
  
  ngOnInit() {
  }

}