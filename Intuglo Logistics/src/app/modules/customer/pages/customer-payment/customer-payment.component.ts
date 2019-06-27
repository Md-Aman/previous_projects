import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CustomerApiService } from '../../services/customer-api.service';

@Component({
  selector: 'customer-payment',
  templateUrl: './customer-payment.component.html',
  styleUrls: ['./customer-payment.component.css']
})
export class CustomerPaymentComponent implements OnInit {

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

  }

}
