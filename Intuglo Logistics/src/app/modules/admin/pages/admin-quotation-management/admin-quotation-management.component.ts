import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  selector: 'admin-quotation-management',
  templateUrl: './admin-quotation-management.component.html',
  styleUrls: ['./admin-quotation-management.component.css']
})
export class AdminQuotationManagementComponent implements OnInit {

  isSideBarOpen: boolean = true;
  isOpen: boolean = true;
  step: string = "order";
  selectedCountry;
  selectedQuotation;
  countryTabChanged : boolean;
  displayActionButtons:boolean;
  isCheckedBooking : boolean = false;
  supplierBookings;
  supplierDetails;
  session:any[];
  selectedRoute;
  vesselId;

  constructor(private router:Router, private service:AdminApiService) {
  }

  receiveDataFromHeader(toggle){
    console.log(toggle);
    this.isSideBarOpen = toggle;
  }

  receiveDataFromChild(data) {
    this.step = data;
  }

  receiveDataFromTopMenu(data) {
    this.step = data;
  }

  receiveIsCheckedChecboxFromCustomerBookings(isCheckedCheckbox){
   this.isCheckedBooking = isCheckedCheckbox;
   this.displayActionButtons = this.isCheckedBooking ;
  }
  receiveCountryTabFromAdminQuotationCountryFilter(countryTab){
    this.countryTabChanged = countryTab;
    this.displayActionButtons = !this.countryTabChanged;
  }
  receiveCountryTabFromSupplierQuotationCountryFilter(countryTab){
    this.countryTabChanged = countryTab;
    // this.displayActionButtons = !this.countryTabChanged && this.isCheckedBooking ;
   }

  onClickOnActionButtonHideActionButtonComponent(hideActionButtonComponent){
    this.displayActionButtons = hideActionButtonComponent;
   }

   receiveRoute(route){
     this.selectedRoute = route;
   }

   receiveVesselId(vessel){
     this.vesselId = vessel;
   }
 
  ngOnInit() {
  }

}
