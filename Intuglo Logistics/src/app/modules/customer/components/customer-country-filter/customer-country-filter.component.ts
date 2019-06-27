import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { CustomerApiService } from "../../services/customer-api.service";
import { MatDialog } from '@angular/material';
import { CustomerSessionExpiredDialogComponent } from '../customer-session-expired-dialog/customer-session-expired-dialog.component';

import { SessionStorage } from '../../../models/session-storage';
@Component({
  selector: "customer-country-filter",
  templateUrl: "./customer-country-filter.component.html",
  styleUrls: ["./customer-country-filter.component.css"]
})
export class CustomerCountryFilterComponent implements OnInit {
  @Output() shareDataToCustomerBookings = new EventEmitter();
  @Output() shareCountryTabToCustomerDashboard = new EventEmitter();
  @Output () shareToggleValueToDashboard = new EventEmitter()

  session = new SessionStorage();

  customerCountry = [];
  customerDetails: any[];
  sessionDetails: any[];
  // session: any[];
  rawJsonCountry: any[];
  customerCountryValues;
  selectedCountry: string;
  countryTabChanged: boolean = false;
  selected: String;
  selectedIndex: string;
  isSessionExpired: any[];
  isToggle: boolean = false;
  showMessage: boolean = false;
  diplayCountryName: boolean = false;

  constructor(
    private service: CustomerApiService, 
    public dialog: MatDialog) {
  }


  ngOnInit() {
    //get list of country
    this.service.getCountryList(this.session.loginID,this.session.sessionID)
      .subscribe(getCountry => {
        this.rawJsonCountry = getCountry;
       if(this.rawJsonCountry.length < 1){
         this.showMessage = true;
       }else{
        this.selectedCountry = this.rawJsonCountry[0]["country"]; //set first array
        // Emiting the first country 
        this.shareDataToCustomerBookings.emit(this.selectedCountry); //share selected country to customer booking component
        this.selectedIndex = this.selectedCountry;
        this.diplayCountryName = true;
       }
      }
      // error => {
      //   if(error.status == 400){
      //     this.dialog.open(CustomerSessionExpiredDialogComponent,{disableClose:true});
      //   }
        // this.isSessionExpired = Object.values(error);
        // if (this.isSessionExpired[1] == 400) {
        //   sessionStorage.clear();
        //   this.router.navigateByUrl("/");
        // }
      // }
      );
  }


  // share selected country to customer booking component
  shareDataToListFilter(country) {
    this.selected = country.country;
    this.shareDataToCustomerBookings.emit(this.selected);
    country.active = !country.active;

    // if (this.service.sessionExpired == true) {
    //   this.dialog.open(SessionExpiredComponent,{disableClose: true});
    //   this.shareToggleValueToDashboard.emit(this.isToggle);
    // }
  }

  onClickSelectedCountry(clickedCountry) {
    this.countryTabChanged = (this.selectedCountry != clickedCountry);
    if (this.selectedCountry != clickedCountry) {
      this.selectedCountry = clickedCountry;
      this.shareCountryTabToCustomerDashboard.emit(this.countryTabChanged);
    }
  
    this.selectedIndex = clickedCountry;
  }
}
