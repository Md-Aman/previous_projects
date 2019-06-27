import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SessionStorage } from '../../../models/session-storage';
import { CustomAgentApiService } from './../../services/custom-agent-api.service';
import { routeConfig } from '../../../../app-routing.module';

@Component({
  selector: 'custom-agent-country-filter',
  templateUrl: './custom-agent-country-filter.component.html',
  styleUrls: ['./custom-agent-country-filter.component.css']
})
export class CustomAgentCountryFilterComponent implements OnInit {
  @Output() shareDataToCustomAgentBookings = new EventEmitter();

  session = new SessionStorage();
  portIDFrom;
  portIDTo;
  portIdDetails;
  portIdDict:any[];
  portIdValues:any[];
  countryValues:any[];
  countryList:any[];
  routeList: any[];
  routeDetails:any[];
  selectedIndex:string;
  selectedRoute:string;

  constructor(private customAgentApiService:CustomAgentApiService) { }

  ngOnInit() {
    // console.log("user id is"+this.session.userID)
    this.customAgentApiService.getCustomAgentCountryList(this.session.loginID,this.session.sessionID)
      .subscribe( getCountry => {
        this.countryList = getCountry;
      })
  }

  OnClickSelectedCountry(country){
    this.customAgentApiService.getCustomAgentRoutes(this.session.loginID,this.session.sessionID,country)
      .subscribe( getRoutes => {
        this.routeList = getRoutes;
      })
  }

  OnChangeSelectedRoute(route){
    this.selectedRoute = route
    return this.selectedRoute;
  }

  shareRouteDetails(){
    this.shareDataToCustomAgentBookings.emit(this.selectedRoute);
  }


}
