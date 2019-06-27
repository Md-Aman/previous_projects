import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ConfigService } from "../../../config/config.service";
import { Http, Headers, ResponseContentType } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { AppComponent } from "./../../../app.component";

@Injectable()
export class CustomAgentApiService {

  sessionExpired:boolean = false;
  orderId:string;
  cargoStatusCode:string;
  customStatusCode:string;

  constructor(private http:Http, private configService:ConfigService) { }
  private subject = new Subject<any>();
  private server_url = this.configService.server_url;

  getCustomAgentProfile(loginID,sessionID){
    return this.http.get(this.server_url + '/CustomAgentProfile' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  getHSWikiList(){
    return this.http.get(this.server_url + '/UsersViewHsWiki')
      .map(response => response.json());
  }

  updateCustomAgentProfile(loginID,sessionID,CustomAgentProfileData){
    return this.http.patch(this.server_url + '/CustomAgentProfile' + '/' + loginID + '/' + sessionID, JSON.stringify(CustomAgentProfileData))
      .map(response => response.json());
  }

  updateCustomAgentPassword(loginID,sessionID,customAgentPasswords){
    return this.http.patch(this.server_url + '/PasswordChange' + '/' + loginID + '/' + sessionID, JSON.stringify(customAgentPasswords))
      .map(response => response.json());
  }

  getCustomAgentCountryList(loginID,sessionID){
    return this.http.get(this.server_url + '/CustomAgentCountryList' + '/' + loginID + '/' + sessionID)
    .map(response => response.json());
  }

  getCustomAgentRoutes(loginID,sessionID,Country){
    return this.http.get(this.server_url + '/CustomAgentRoutes' + '/' + loginID + '/' + sessionID + '/' + Country)
      .map(response => response.json());
  }

  getBusinessIndustryCountry(loginID, sessionID){
    return this.http.get(this.server_url + '/SupplierProfileInit' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  //upload file for custom agent
  agentUploadFile(FormData) {
    return this.http.post(this.server_url + "/UserUploadProfile", FormData)
      .map(response => response.json());
  }

  // delete profile file in server
  deleteProfileDocument(loginID,sessionID,documentDetails){
    return this.http.patch(this.server_url + "/UserProfileFile"+ '/' + loginID + '/' + sessionID, JSON.stringify(documentDetails))
      .map(response => response.json());
  }

  //get list of profile documents
  getProfileDocuments(loginID,sessionID){
    return this.http.get(this.server_url + "/UserProfileFile"+ '/' + loginID + '/' + sessionID)
    .map(response => response.json());
  }
  getCustomAgentRouteDetails(loginID,sessionID,departureCountryCode,arrivalCountryCode){
    return this.http.get(this.server_url + '/CustomAgentListOfRoutes' + '/' + loginID + '/' + sessionID +
        '/' + departureCountryCode + '-' + arrivalCountryCode)
        .map(response => response.json());
  }

  changeCustomStatus(loginID,sessionID,orderDetails){
    return this.http.patch(this.server_url + "/ChangeCustomStatus"+ '/' + loginID + '/' + sessionID, JSON.stringify(orderDetails))
      .map(response => response);
  }

  sendUpdateAdminBooking(){
    this.subject.next({});
  }
  getUpdateAdminBooking(): Observable<any> {
    return this.subject.asObservable();
  }
}
