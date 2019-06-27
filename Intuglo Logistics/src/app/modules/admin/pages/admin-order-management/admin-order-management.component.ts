import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  selector: 'admin-order-management',
  templateUrl: './admin-order-management.component.html',
  styleUrls: ['./admin-order-management.component.css']
})
export class AdminOrderManagementComponent implements OnInit {

  isSideBarOpen: boolean = true;
  isOpen: boolean = true;
  step: string = "booking";
  selectedCountry;
  selectedQuotation;
  routeTabChanged : boolean;
  displayActionButtons:boolean;
  isCheckedBooking : boolean;
  supplierBookings;
  supplierDetails;
  session:any[];
  orderID;
  selectedRoute;
  supplierID;
  vesselID;
  quotationID;


  constructor(private router:Router, private service:AdminApiService) {
  }

  receiveDataFromHeader(toggle){
    this.isSideBarOpen = toggle;
  }

  receiveDataFromAdminOrderActionTopMenu(selectedStep) {
    this.step = selectedStep;
  }

  receiveFromOrderID(data) {
    this.orderID = data;
  }

  receiveDataFromAdminOrderList(data){
    this.isCheckedBooking = data;
  }

  receiveDataFromAdminCountryFilter(countryFilter) {
    this.selectedCountry = countryFilter;
  }

  receiveDataFromAdminFilter(country){
    this.selectedCountry = country;
  }
  
  receiveCountryTabFromAdminCountryFilter(countryTab){
    this.routeTabChanged = countryTab;
    this.displayActionButtons = !this.routeTabChanged;
  }

  receiveToggleValue(){     
  }

  receiveRoute(route){
    this.selectedRoute = route;
  }

  receiveVessel(vessel){
    this.vesselID = vessel;
  }

  receiveSupplier(supplier){
    this.supplierID = supplier;
  }

  receiveQuotationId(quotationId){
    this.quotationID = quotationId;
  }
  getHideAdminActionButtons(isClicked){
    this.isCheckedBooking = isClicked;
  }

  ngOnInit() {
  }

}
