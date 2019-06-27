import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CustomerApiService } from '../../services/customer-api.service';
@Component({
  selector: 'customer-profile-page',
  templateUrl: './customer-profile-page.component.html',
  styleUrls: ['./customer-profile-page.component.css']
})
export class CustomerProfilePageComponent implements OnInit {
  customerBookings = [];
  step: string = "booking";
  isSideBarOpen: boolean = true;
  // isCheckedBooking : boolean = false;
  customerDetails:any[];
  sessionDetails: any[];
  LogoBool;
  session:any[];
  rawJsonBookingDetails:any[];
  isCustomerName;
  

  constructor(private router:Router, private service:CustomerApiService) { }

  receiveDataFromTopMenu(data) {
    this.step = data;
  }
  recieveLogoFromProfileLogoUploader(recieveLogo){
    
    this.LogoBool = recieveLogo;
  }
  getCustomerNameFromCustomerProfile(customerName){
    this.isCustomerName = customerName;
  }
  // receiveDataFromCustomerBookings(data){
  //  this.isCheckedBooking = data;
  // }
  receiveDataFromHeader(toggle){
    this.isSideBarOpen = toggle;
  }

  ngOnInit() {
    // getting customer session from login
    // this.customerDetails = JSON.parse(sessionStorage.getItem("customer-session"))

    // if(this.customerDetails == null){
    //   this.router.navigateByUrl("/")
    // }else{
    //   this.session = Object.values(this.customerDetails);
    // }
    // this.sessionDetails = Object.values(this.customerDetails);

  }

}
