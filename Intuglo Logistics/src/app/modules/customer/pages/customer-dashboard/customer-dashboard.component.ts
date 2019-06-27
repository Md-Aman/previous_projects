import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CustomerApiService } from '../../services/customer-api.service';
import { CustomerCountryFilterComponent } from '../../components/customer-country-filter/customer-country-filter.component';

@Component({
  selector: 'customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {

  selectedCountry: String;
  customerBookings = [];
  step: string = "booking";
  isSideBarOpen: boolean = true;
  isCheckedBooking : boolean = false;
  customerDetails:any[];
  sessionDetails: any[];
  // session:any[];
  rawJsonBookingDetails:any[];
  countryTabChanged : boolean;
  displayActionButtons:boolean;

  isOpen:boolean = true;

  constructor(private router:Router, private service:CustomerApiService) {
  }

  receiveDataFromCountryFilter(countryFilter) {
    this.selectedCountry = countryFilter;
  }

  receiveDataFromTopMenu(data) {
    this.step = data;
  }
  receiveIsCheckedChecboxFromCustomerBookings(isCheckedCheckbox){
   this.isCheckedBooking = isCheckedCheckbox;
   this.displayActionButtons = this.isCheckedBooking ;
  }
  receiveCountryTabFromCustomerCountryFilter(countryTab){
    this.countryTabChanged = countryTab;
    this.displayActionButtons = !this.countryTabChanged && this.isCheckedBooking ;
   }

   onClickOnActionButtonHideActionButtonComponent(hideActionButtonComponent){
    this.displayActionButtons = hideActionButtonComponent;
   }

  //  Please add component if you are passing toggle data to here (dashboard) from another component
  //  customer navbar , 
  //  customer country filter

   receiveToggleValue(toggle){
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
