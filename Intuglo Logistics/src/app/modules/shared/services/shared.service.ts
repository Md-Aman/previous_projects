import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Http } from "@angular/http";
import { ConfigService } from "../../../config/config.service";
import { HSWiki } from "../../models/hswiki";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import {ToastrService} from 'ngx-toastr';


@Injectable()
export class SharedService {

  orderId: string;
  orderStatusCode:string;
  buttonCode:string;
  profilePermissionFlag:string;
  private messageSource = new BehaviorSubject<any>({event: ''});
  currentMessage = this.messageSource.asObservable();

  constructor( private httpClient: HttpClient,private http: Http, private configService: ConfigService
    , private toastr: ToastrService) {
  }
  changeMessage(message: any) {
    this.messageSource.next(message)
  }
  private server_url = this.configService.server_url;
  private subject = new Subject<any>();
  formatedBinary: any;


  paddingZero(str, size) {
    while (str.length < size) str = "0" + str;
    return str;
  }

  uploadProfileLogo(image){
    return this.http.post(this.server_url + "/UploadProfilePicture",image)
    .map(response => response.status);
  }

  sendButtonCode(buttonCode) {
    this.formatedBinary = (buttonCode).toString(2);
    this.formatedBinary = this.paddingZero(this.formatedBinary, 24);
    this.subject.next(this.formatedBinary);
  }
  getButtonCode(): Observable<Number> {
    return this.subject.asObservable();
  }

  getCreditBlockReceipt(loginID,sessionID, orderId) {
    return this.http.get(this.server_url + '/Booking' + '/' + loginID + '/' + sessionID + '/' + orderId)
      .map(response => response.json());
  }

  getBookingPDF(loginID,sessionID, orderId) {
    return this.http.get(this.server_url + '/Booking' + '/' + loginID + '/' + sessionID + '/' + orderId)
      .map(response => response.json());
  }

  viewBooking(loginID,sessionID, orderId) {
    return this.http.get(this.server_url + '/Booking' + '/' + loginID + '/' + sessionID + '/' + orderId)
      .map(response => response.json());
  }
  checkUserSession(loginID,sessionID) {
    return this.http.get(this.server_url + '/CheckUserSession' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }
  // patchBookingStatus(loginID,sessionID,orderDetails){
  //   return this.http.patch(this.server_url + '/ChangeBookingStatusToCancel' + '/' + loginID + '/' + sessionID,JSON.stringify(orderDetails))
  //   .map(response => response.json());
  // }

  patchBookingStatus(loginID,sessionID,orderDetails){
    return this.http.patch(this.server_url + '/ChangeBookingStatus' + '/' + loginID + '/' + sessionID,JSON.stringify(orderDetails))
    .map(response => response);
  }

  ChangePaymentStatus(loginID,sessionID,orderDetails){
    return this.http.patch(this.server_url + '/ChangePaymentStatus' + '/' + loginID + '/' + sessionID,JSON.stringify(orderDetails))
    .map(response => response);
  }
  changeCustomStatus(loginID,sessionID,orderDetails){
    return this.http.patch(this.server_url + '/ChangeCustomStatus' + '/' + loginID + '/' + sessionID,JSON.stringify(orderDetails))
    .map(response => response.json());

  }
  updateChangePassword(loginID,sessionID,supplierPasswords) {
    return this.http.patch(this.server_url + '/PasswordChange' + '/' + loginID + '/' + sessionID, JSON.stringify(supplierPasswords))
      .map(response => response.json());
  }

  //get list of profile documents
  getProfileDocuments(loginID,sessionID){
    return this.http.get(this.server_url + "/UserProfileDocumentUploader"+ '/' + loginID + '/' + sessionID)
    .map(response => response.json());
  }

  uploadProfileDocument(loginID, sessionID, profileDocument){
    return this.http.post(this.server_url + "/UserProfileDocumentUploader" + '/' + loginID + '/' + sessionID, profileDocument)
      .map(response => response.json())
  }

  // uploadProfileDocument(loginID, sessionID, merchantID, profileDocument){
  //   return this.http.post(this.server_url + "/UserProfileDocumentUploader" + '/' + loginID + '/' + sessionID + '/' + merchantID, profileDocument)
  //     .map(response => response.json())
  // }

  // delete profile file in server
  deleteProfileDocument(loginID,sessionID,documentDetails){
    return this.http.patch(this.server_url + "/UserProfileDocumentUploader"+ '/' + loginID + '/' + sessionID, JSON.stringify(documentDetails))
      .map(response => response);
  }

  getProfileLogo(loginID,sessionID,userType) {
    return this.http.get(this.server_url + '/DisplayProfilePicture' + '/' + loginID + '/' + sessionID + '/' + userType)
      .map(response => response.json());
  }

  getSuppProfileLogo(loginID,sessionID) {
    return this.http.get(this.server_url + '/SupplierProfileCompanyLogo' + '/' + loginID + '/' + sessionID)
  }
  checkProfilePermission(loginID,sessionID){
    return this.http.get(this.server_url + '/SupplierCustomDashboardAction' + '/' + loginID + '/' + sessionID)
      .map( res => res.json());
  }

  getHSWikiListMat(): Observable<HSWiki[]>{
    return this.httpClient.get<HSWiki[]>(this.server_url + '/UsersViewHsWiki')
    }

  toggleToaster(msg, type) {
    if ( type == 'error' ) {
      this.toastr.error(
        msg,
        "Unsuccessful!",
        {
          closeButton: true,
          progressBar: true,
          progressAnimation: "increasing",
          positionClass: "toast-top-right"
        }
      );
    } else {
      this.toastr.success(
        msg,
        "Successful!",
        {
          closeButton: true,
          progressBar: true,
          progressAnimation: "increasing",
          positionClass: "toast-top-right"
        }
      );
    }
  }

}
