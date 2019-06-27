import { Subject } from 'rxjs/Subject';
import { ConfigService } from "../../../config/config.service";
import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { AppComponent } from "./../../../app.component";
// import "rxjs/add/operator/catch";
// import "rxjs/add/observable/throw";

@Injectable()
export class AdminApiService {

  sessionExpired:boolean = false;
  quotationId: string;
  quotationStatus: string;
  orderID: string;

  constructor(private http: Http, private configService: ConfigService) { }
  private subject = new Subject<any>();
  private server_url = this.configService.server_url;

  // get list of customer booking based on supplier id
  getAdminOrderListByQuotations(loginID,sessionID,quotationID) {
    return this.http.get(this.server_url + '/AdminOrderListByQuotations' + '/' + loginID + '/' + sessionID + '/' + quotationID)
      .map(response => response.json());
  }
  
  // get list of orders
  getAdminOrderList(loginID,sessionID) {
    return this.http.get(this.server_url + '/AdminOrderList' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  sendUpdateAdminOrderList() {
    this.subject.next();
  }

  getUpdateAdminOrderList(): Observable<any> {
    return this.subject.asObservable();
  }

  getAdminUsersCountryList(loginID, sessionID){
    return this.http.get(this.server_url + '/AdminCountryList' + '/' + loginID + '/' + sessionID )
      .map(response => response.json());
  }

  getAdminUserList(loginID, sessionID, selectedUserType,selectedCountry){
    return this.http.get(this.server_url + '/AdminViewListOfUser' + '/' + loginID + '/' + sessionID + '/' + selectedUserType+ '/' +selectedCountry)
      .map(response => response.json());
  }

  // update user status to verified user
  activateUserStatus(loginID,sessionID,userVerificationStatus) {
    return this.http.patch(this.server_url + "/AdminVerifiedUser" + '/' + loginID + '/' + sessionID, JSON.stringify(userVerificationStatus))
      .map(response => response.json());
  }

  getUserProfileDocuments(loginID,sessionID,userId){
    return this.http.get(this.server_url + '/UserProfileDocumentDownloader' + '/' + loginID + '/' + sessionID + '/' + userId)
      .map(response => response.json());
  }

   // get list of grouped-countries based on supplier orders
   getAdminCountryByQT(loginID,sessionID) {
    return this.http.get(this.server_url + '/AdminCountryByQT' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  // get list of routes by selected country, type will be page name
  getAdminRoutesByCountry(loginID, sessionID, selectedCountry, type = 'order') {
    return this.http.get(this.server_url + '/AdminRoutesByCountry'+ '/' 
      + loginID + '/' + sessionID + '/' + selectedCountry + "?type=" + type)
    .map(response => response.json());
  }

  // get filter list (vessel name and quotation id) based on selected country
  getAdminFilterList(loginID,sessionID) {
    return this.http.get(this.server_url + '/AdminFilterList' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  // get list of quotations based on selected vessel_no
  getQuotationListByVessel(loginID,sessionID,vesselID) {
    return this.http.get(this.server_url + '/AdminQTByVessel' + '/' + loginID + '/' + sessionID + '/' + vesselID)
    .map(response => response.json());
  }

  // get quotation id and quotation status from quotation list component
  sendQId(qId, qStatus) {
    this.quotationId = qId;
    this.quotationStatus = qStatus;
  }

  // send quotation id and quotation status to action button component
  getQId() {
    return this.quotationId, this.quotationStatus;
  }

  // get quotation id from quotation list component
  sendQIdToView(qId){
    this.quotationId = qId;
  }
  
  // send quotation id to view quotation template component
  getQIdToView(){
    return this.quotationId;
  }

  // get list of quotations based on selected vessel id and supplier id
  getQuotationList(loginID,sessionID, vesselID, supplierID) {
    return this.http.get(this.server_url + '/AdminQTByVesselAndSupplier' + '/' + loginID + '/' + sessionID + '/' + vesselID + '/' + supplierID)
      .map(response => response.json());
  }

  // get list of quotation's filter details for admin quotation component
  getQuotationFilterList(loginID,sessionID) {
    return this.http.get(this.server_url + '/AdminQuotationFilterList' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  // get list of country
  getQuotationCountryList(loginID,sessionID) {
    return this.http.get(this.server_url + '/AdminQuotationCountryList' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }
  
   sendUpdateQuotationList() {
    this.subject.next();
  }

  getUpdateQuotationList(): Observable<any> {
    return this.subject.asObservable();
  }

  // update quotation status from PENDINGAPPROVAL TO APPROVED
  approvedQuotation(loginID,sessionID,quotationId) {
    return this.http.patch(this.server_url + "/AdminChangeQuotationStatus" + '/' + loginID + '/' + sessionID, JSON.stringify(quotationId))
      .map(response => response.json());
  }
  
  // update order status to ORDERDROPPED
  patchAdminBookingStatus(loginID,sessionID,orderId){
    return this.http.patch(this.server_url + "/AdminOrderDroppedChangeStatus" + '/' + loginID + '/' + sessionID, JSON.stringify(orderId))
      .map(response => response.json());
  }

  // update order status
  lockInOrder(loginID,sessionID,orderId) {
    return this.http.patch(this.server_url + "/ChangeBookingStatus" + '/' + loginID + '/' + sessionID, JSON.stringify(orderId))
      .map(response => response.json());
  }

  // get quotation's filter information based on selected route id 
  getAdminFilterListInfo(loginID,sessionID,routeId){
    return this.http.get(this.server_url + '/AdminVesselByPortAndDeparture' + '/' + loginID + '/' + sessionID + '/' + routeId)
    .map(response => response.json());
  }

  // get supplier details
  getAdminSupplierListInfo(loginID,sessionID,vesselID){
    return this.http.get(this.server_url + '/AdminSupplierListByVessel' + '/' + loginID + '/' + sessionID + '/' + vesselID)
    .map(response => response.json());
  }

  // get quotation details based on selected quotation id
  getQuotationDetails(loginID,sessionID,quotationId){
    return this.http.get(this.server_url + '/Quotation' + '/' + loginID + '/' + sessionID + '/' + quotationId)
    .map(response => response.json());
  }

  // get file name to download file
  downloadQuotationFile(loginID,sessionID,quotationId) {
    return this.http.get(this.server_url + '/DownloadSupplierQuotation' + '/' + loginID + '/' + sessionID +'/' + quotationId)
  }

  //Admin Generate Payment List
  getCountryListForPayment (loginID, sessionID) {
    return this.http.get(this.server_url + '/AdminCountryList' + '/' + loginID + '/' + sessionID)
    .map(response => response.json());
  }

  getAdminPaymentResources(loginID, sessionID, selectedMonth, selectedCountry) {
    return this.http.get(this.server_url + '/AdminPaymentFiltration' + '/' + loginID + '/' + sessionID +'/' + selectedMonth +'/' + selectedCountry)
      .map(response => response.json());
  }

  getAdminPaymentList(loginID, sessionID, selectedVessel){
    return this.http.get(this.server_url + '/AdminPaymentList' + '/' + loginID + '/' + sessionID +'/' + selectedVessel)
    .map(response => response.json());
  }

// Admin Employee Worksheet Report

getCountryListForEmployeeReport(loginID, sessionID) {
  return this.http.get(this.server_url + '/AdminCountryList' + '/' + loginID + '/' + sessionID)
  .map(response => response.json());
}

getAdminEmployeeResources(loginID, sessionID, selectedMonth, selectedCountry) {
  return this.http.get(this.server_url + '/AdminPaymentFiltration' + '/' + loginID + '/' + sessionID +'/' + selectedMonth +'/' + selectedCountry)
    .map(response => response.json());
}

getAdminEmployeeList(loginID, sessionID, selectedVessel){
  return this.http.get(this.server_url + '/AdminEmployeeList' + '/' + loginID + '/' + sessionID +'/' + selectedVessel)
  .map(response => response.json());
}

}