import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AdminApiService } from "../../services/admin-api.service";
import { SessionStorage } from '../../../models/session-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-quotation-country-list',
  templateUrl: './admin-quotation-country-list.component.html',
  styleUrls: ['./admin-quotation-country-list.component.css']
})
export class AdminQuotationCountryListComponent implements OnInit {
  @Output() shareRouteToAdminQuotation = new EventEmitter();
  @Output() shareCountryTabToQuotationManagement = new EventEmitter();
  session = new SessionStorage();

  countryList;
  selectedCountry;
  selectedIndex;
  displayCountryName: boolean = false;
  countryTabChanged: boolean = false;
  routeList;
  selected;
  firstCountry;
  type = 'quotation'; // just to send page name to exclude active check
  constructor(private service:AdminApiService, private router: Router) { }

  ngOnInit() {
    // get list of countries
    this.service.getAdminCountryByQT(this.session.loginID,this.session.sessionID)
    .subscribe( getCountryInfo => {
      this.countryList = getCountryInfo;
      this.firstCountry = this.countryList[0].country_code_dep_name; //set first array
      this.getRouteByCountry(this.firstCountry);
    });
  }

  // on click country, get countryFrom-countryTo route
  onClickSelectedCountry(country){
    this.selectedCountry = country;
    this.getRouteByCountry(this.selectedCountry);
  }
  getRouteByCountry(country) {
    this.service.getAdminRoutesByCountry(this.session.loginID,this.session.sessionID, 
      country, this.type )
      .subscribe( getCountryInfo => {
        this.routeList = getCountryInfo;
        this.selectedCountry = this.routeList[0].country_code; //set first array
        this.selectedIndex = this.selectedCountry;
        this.displayCountryName = true;
        this.shareDataToListFilter(this.routeList[0]) //call function by passing first array
      });
  }
  // send selected route to admin quotation list filter
  shareDataToListFilter(route) {
    this.selected = route.country_code ? route.country_code: undefined;
    this.shareRouteToAdminQuotation.emit(this.selected); //share selected route to admin quotation filter list component
    route.active = !route.active;

    if (this.service.sessionExpired != false) {
      // this.dialog.open(SessionExpiredComponent,{disableClose: true});
      // this.shareToggleValueToDashboard.emit(this.isToggle);
    }
  }

  onClickSelectedRoutes(clickedRoute) {
    this.countryTabChanged = (this.selectedCountry != clickedRoute);
    if (this.selectedCountry != clickedRoute) {
      this.selectedCountry = clickedRoute;
    }
    this.shareCountryTabToQuotationManagement.emit(this.countryTabChanged);
    this.selectedIndex = clickedRoute;
  }

}
