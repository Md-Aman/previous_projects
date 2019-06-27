import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SupplierApiService } from '../../services/supplier-api.service';

@Component({
  selector: 'supplier-profile-page',
  templateUrl: './supplier-profile-page.component.html',
  styleUrls: ['./supplier-profile-page.component.css']
})
export class SupplierProfilePageComponent implements OnInit {

  isSideBarOpen: boolean = true;
  step: string = "order";
  selectedCountry: number = 1;
  isCheckedBooking : boolean = false;
  supplierBookings;
  supplierDetails;
  LogoBool;
  isSupplierName;
  // session:any[];

  constructor(private router:Router, private service:SupplierApiService) { 
    // getting supplier session from login
    // this.supplierDetails = JSON.parse(sessionStorage.getItem("supplier-session"));

    // if(this.supplierDetails == null){
    //   this.router.navigateByUrl("/")
    // }else{
    //   this.session = Object.values(this.supplierDetails);
    // }
  }

  recieveLogoFromProfileLogoUploader(recieveLogo){
    
    this.LogoBool = recieveLogo;
  }

  receiveDataFromHeader(toggle){
    console.log(toggle);
    this.isSideBarOpen = toggle;
  }
  receiveDataFromChild(data) {
    this.step = data;
  }
  receiveDataFromCountryFilter(countryFilter) {
    this.selectedCountry = countryFilter;
  }
  receiveDataFromSupplierBooking(data){
    this.isCheckedBooking = data;
  }
  getSupplierNameFromSupplierProfile(supplierName){
    this.isSupplierName = supplierName;
  }
  ngOnInit() {
  }

}
