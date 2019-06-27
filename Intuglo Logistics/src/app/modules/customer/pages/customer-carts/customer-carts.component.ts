import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CustomerApiService } from '../../services/customer-api.service';

@Component({
  selector: 'customer-carts',
  templateUrl: './customer-carts.component.html',
  styleUrls: ['./customer-carts.component.css']
})
export class CustomerCartsComponent implements OnInit {
  customerBookings = [];
  step: string = "booking";
  isSideBarOpen: boolean = true;
  // isCheckedBooking : boolean = false;
  customerDetails:any[];
  sessionDetails: any[];
  session:any[];
  rawJsonBookingDetails:any[];

  isOpen:boolean = true;

  constructor(private router:Router, private service:CustomerApiService) { }
  receiveDataFromTopMenu(data) {
    this.step = data;
  }
  // receiveDataFromCustomerBookings(data){
  //  this.isCheckedBooking = data;
  // }
  receiveDataFromHeader(toggle){
    this.isSideBarOpen = toggle;
  }

  ngOnInit() {
     // getting customer session from login
    //  this.customerDetails = JSON.parse(sessionStorage.getItem("customer-session"))

    //  if(this.customerDetails == null){
    //    this.router.navigateByUrl("/")
    //  }else{
    //    this.session = Object.values(this.customerDetails);
    //  }
    //  this.sessionDetails = Object.values(this.customerDetails);
  }

}
