import { Http } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { AppComponent } from "./../../../app.component";
import { Subject } from "rxjs/Subject";
import { ConfigService } from "../../../config/config.service";

@Injectable()
export class PublicApiService {
  searchbox: any;
  userType: number;
  // url: string;
  userName: string;
  check: any[];
  containerId: string;
  search_result_data_length: number;
  search_result_type: string;
  booking_price_without_tax: string;
  booking_price_with_tax: string;
  booking_total_part_a: string;
  booking_total_price_arrival: string;
  booking_total_price_departure: string;
  booking_tax_type: string;
  booking_tax_percentage: string;
  booking_tax_amount: string;

  constructor(private http: Http, private configService: ConfigService) {}

  // get server url from config service
  private server_url = this.configService.server_url;

  private subject = new Subject<any>();

  // , private searchInitUrl:AppConfig

  // url = this.searchInitUrl.Url;
  // this function is called at login popup component to send user name to nav bar component
  sendUserName(userName) {
    console.log(userName);
    this.subject.next({ name: userName });
  }

  getUserName(): Observable<any> {
    return this.subject.asObservable();
  }

  getSearchboxLists() {
    return this.http
      .get(this.server_url + "/SearchInit")
      .map(response => response.json());
  }

  getSignupInit(userType) {
    return this.http
      .get(this.server_url + "/SignUpInit/" + userType)
      .map(response => response.json());
  }

  postSignup(user) {
    return this.http
      .post(this.server_url + "/SignUp", JSON.stringify(user))
      .map(response => response.json());
  }
  checkEmailValidity(email) {
    return this.http
      .get(this.server_url + "/CheckEmailValidity/" + email)
      .map(response => response.json());
  }
  resetPassword(token) {
    return this.http
      .patch(this.server_url + "/ResetPassword/", JSON.stringify(token))
      .map(response => response.json());
  }
  //  posting booknow component data
  postBooknow(loginID, sessionID,cartID, booking_data) {
    return this.http
      .post(
        this.server_url + "/Booking" + "/" + loginID + "/" + sessionID+ "/"+cartID,
        JSON.stringify(booking_data)
      )
      .map(response => response.json());
  }

  getLoginDetails(user) {
    return this.http
      .get(
        this.server_url + "/Login" + "/" + user.userEmail + "/" + user.password
      )
      .map(respose => respose.json())
      .catch(this._errorHandler);
  }

  // Get Pricing Details
  getPricingDetails() {
    return this.http
      .get(
        this.server_url + "/PlatformPricing" 
      )
      .map(respose => respose.json())
      .catch(this._errorHandler);
  }

  // For Book Now Component
  getBookingInit(loginID, sessionID, containerId) {
    return this.http
      .get(
        this.server_url +
          "/BookingInit" +
          "/" +
          loginID +
          "/" +
          sessionID +
          "/" +
          containerId
      )
      .map(response => response.json());
  }

  getAgentList(loginID, sessionID) {
    return this.http
      .get(
        this.server_url + "/CustomAgentList" + "/" + loginID + "/" + sessionID
      )
      .map(response => response.json());
  }

  getDuplicateEmail(email) {
    return this.http
      .get(this.server_url + "/CheckDuplicateEmail" + "/" + email)
      .map(response => response.json());
  }
  
  getPackingTypesList(loginID, sessionID){
    return this.http
      .get(this.server_url + "/PackingTypesList" + "/" + loginID + "/" + sessionID)
      .map(response => response.json());
  }
  private _errorHandler(error: Response) {
    return Observable.throw(error.json() || "some error occured");
  }

  sendQId(qId) {
    this.containerId = qId;
  }

  getQId() {
    return this.containerId;
  }

  sendUpdateSearchResult() {
    this.subject.next({});
  }

  getUpdateSearchResult(): Observable<any> {
    return this.subject.asObservable();
  }
  setNewSearchValue() {
    this.subject.next();
  }
  getNewSearchValue(): Observable<any> {
    return this.subject.asObservable();
  }
}
