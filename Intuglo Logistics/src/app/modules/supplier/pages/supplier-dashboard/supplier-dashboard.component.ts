import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SupplierApiService } from '../../services/supplier-api.service';
import { SupplierCountryFilterComponent } from '../../components/supplier-country-filter/supplier-country-filter.component';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';


@Component({
  selector: 'supplier-dashboard',
  templateUrl: './supplier-dashboard.component.html',
  styleUrls: ['./supplier-dashboard.component.css']
})
export class SupplierDashboardComponent implements OnInit {


  isSideBarOpen: boolean = true;
  step: string = "order";
  selectedCountry;
  selectedQuotation;
  countryTabChanged : boolean;
  displayActionButtons:boolean;
  isCheckedBooking : boolean = false;
  supplierBookings;
  supplierDetails;
  containerId;
  selectedQuotationId;
  checkedMasterCheckBox:boolean;
  showActionButton:boolean;
  isOpen: boolean = true;

  constructor(private router:Router, private service:SupplierApiService) {

    // getting supplier session from login
    // this.supplierDetails = JSON.parse(sessionStorage.getItem("supplier-session"));

    // if(this.supplierDetails == null){
    //   this.router.navigateByUrl("/")
    // }else{
    //   this.session = Object.values(this.supplierDetails);
    // }
  }
  receiveContainerId(containerId){
    this.containerId = containerId;
  }
  receiveDataFromHeader(toggle){
    this.isSideBarOpen = toggle;
  }
  receiveDataFromChild(data) {
    this.step = data;
  }
  getCheckedMasterCheckBoxFromBookings(isCheckedMasterCheckBox){
    this.checkedMasterCheckBox = isCheckedMasterCheckBox;
    // this.showActionButton = isCheckedMasterCheckBox ||this.isCheckedBooking;
    this.isCheckedBooking = false;
  }
  receiveDataFromSupplierBooking(data){
    this.isCheckedBooking = data;
    // this.showActionButton = data || this.checkedMasterCheckBox;
    this.checkedMasterCheckBox = false;
  }

  receiveDataFromCountryFilter(countryFilter) {
    this.selectedCountry = countryFilter;
  }

  receiveCountryTabFromSupplierCountryFilter(countryTab){
    this.countryTabChanged = countryTab;
    this.displayActionButtons = !this.countryTabChanged && this.isCheckedBooking ;
   }

   receiveQId(quotationId){
     this.selectedQuotationId = quotationId;
   }
   onClickOnActionButtonHideActionButtonComponent(hideActionButtonComponent){
    this.isCheckedBooking = hideActionButtonComponent;
   }
  //  Please add component if you are passing toggle data to here (dashboard) from another component
  //  customer navbar , 
  //  customer country filter

   receiveToggleValue(toggle){
    this.isSideBarOpen = toggle;
   }


  ngOnInit() {

  }

}
