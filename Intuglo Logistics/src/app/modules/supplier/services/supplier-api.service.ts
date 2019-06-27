import { Subject } from 'rxjs/Subject';
import { ConfigService } from "../../../config/config.service";
import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { AppComponent } from "./../../../app.component";
// import "rxjs/add/operator/catch";
// import "rxjs/add/observable/throw";

@Injectable()
export class SupplierApiService {

  sessionExpired:boolean = false;
  quotationId: string;
  quotationStatus: string;

  constructor(private http: Http, private configService: ConfigService) { }
  private subject = new Subject<any>();
  private server_url = this.configService.server_url;
  // sessionExpired:boolean=false;

  // get lists of hs_code, incoterms, shipment types and ports
  getPortHsCode() {
    return this.http.get(this.server_url + '/QuotationInit')
      .map(response => response.json());
  }

  getHSWikiList(){
    return this.http.get(this.server_url + '/UsersViewHsWiki')
      .map(response => response.json());
  }

  // get list of customer booking based on supplier id
  getSupplierBookings(loginID,sessionID) {
    return this.http.get(this.server_url + '/SupplierOrderList' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  // get list of quotations based in supplier id
  getSupplierQuotation(loginID,sessionID) {
    return this.http.get(this.server_url + '/QuotationList' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  // update supplier's information
  updateSupplierProfile(loginID,sessionID,supplierProfileData) {
    return this.http.patch(this.server_url + '/SupplierProfile' + '/' + loginID + '/' + sessionID, JSON.stringify(supplierProfileData))
      .map(response => response.json());
  }

  // get supplier's information for profile component
  getSupplierProfile(loginID,sessionID) {
    return this.http.get(this.server_url + '/SupplierProfile' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  // upload file in NQT component and modify template
  postUploadFile(FormData) {
    return this.http.post(this.server_url + '/UploadFile', FormData).map(response => response.json());
  }

  // get list of grouped-countries based on supplier orders
  // getCountryList(loginID,sessionID) {
  //   return this.http.get(this.server_url + '/SupplierCountryList' + '/' + loginID + '/' + sessionID)
  //     .map(response => response.json());
  // }

  // get list of grouped-countries based on supplier orders
  getSupplierBookingCountryList(loginID,sessionID) {
    return this.http.get(this.server_url + '/SupplierCountryList' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  getSupplierPaymentList(loginID,sessionID,vesselID){
    return this.http.get(this.server_url + '/SupplierPaymentList' + '/' + loginID + '/' + sessionID + '/' + vesselID)
      .map(response => response.json());
  }
  // create new quotation
  updateNewQuotation(loginID,sessionID,supplierQuotationData) {
    if ( typeof supplierQuotationData.quotationId == 'undefined' ||  supplierQuotationData.quotationId == '' ) {
      return this.http.post(this.server_url + '/Quotation' + '/' + loginID + '/' + sessionID, JSON.stringify(supplierQuotationData))
        .map(response => response.json());
    } else {
      return this.http.patch(this.server_url + '/Quotation' + '/' + loginID + '/' + sessionID, JSON.stringify(supplierQuotationData))
        .map(response => response.json());
    }

  }

  // create handling charges details based on quotation id
  postHandlingCharges(loginID, sessionID, quotationId, supplierQuotationData, method) {
    if ( method== 'post' ) {
      return this.http.post(this.server_url + '/QuotationChargesBlock' + '/' + loginID + '/' + sessionID + '/' + quotationId, JSON.stringify(supplierQuotationData))
        .map(response => response.json());
    } else {
      return this.http.patch(this.server_url + '/QuotationChargesBlock' + '/' + loginID + '/' + sessionID + '/' + quotationId, JSON.stringify(supplierQuotationData))
        .map(response => response.json());
    }

  }

  // create handling charges details based on quotation id
  postSeaFreightCharges(loginID, sessionID, quotationId, supplierQuotationData, method) {
    if ( method == 'post' ) {
      return this.http.post(this.server_url + '/QuotationChargesPartA' + '/' + loginID + '/' + sessionID + '/' + quotationId, JSON.stringify(supplierQuotationData))
        .map(response => response.json());
    } else {
      return this.http.patch(this.server_url + '/QuotationChargesPartA' + '/' + loginID + '/' + sessionID + '/' + quotationId, JSON.stringify(supplierQuotationData))
        .map(response => response.json());
    }

  }

  // get list of businesses and industries
  getBusinessIndustry(loginID,sessionID) {
    return this.http.get(this.server_url + '/SupplierProfileInit' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  // get list of grouped-quotations based on quotation list and supplier id
  getQuotationCountryList(loginID,sessionID) {
    return this.http.get(this.server_url + '/QuotationCountryList' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  // get filter list (vessel name and quotation id) based on selected country
  getSupplierBookingFilterList(loginID,sessionID) {
    return this.http.get(this.server_url + '/SupplierFilterList' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  // getSupplierQuotationFilterList(supplierLoginDetails, selectedCountry){
  //   return this.http.get(this.server_url + '/QuotationFilterList' + '/' + supplierLoginDetails[0] + '/' + supplierLoginDetails[1] + '/' + selectedCountry)
  //   .map(response => response.json());
  // }

  // get filter list (port name and vessel name) based on selected country
  getSupplierQuotationFilterList(loginID,sessionID) {
    return this.http.get(this.server_url + '/QuotationFilterList' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  // update order status to "cargopickup"
  patchBookingStatusToCargoPickedUp(loginID,sessionID, orderId) {
    return this.http.patch(this.server_url + '/ChangeBookingStatusToCargoPickedUp' + '/' + loginID + '/' + sessionID, JSON.stringify(orderId))
      .map(response => response.json());
  }

  // update order status to "cargoreceived"
  patchBookingStatusToCargoReceived(loginID,sessionID, orderId) {
    return this.http.patch(this.server_url + '/ChangeBookingStatusToCargoReceived' + '/' + loginID + '/' + sessionID, JSON.stringify(orderId))
      .map(response => response.json());
  }

  // update order status to "cargoshipped"
  patchBookingStatusToCargoShipped(loginID,sessionID,orderId) {
    return this.http.patch(this.server_url + '/api resource name' + '/' + loginID + '/' + sessionID, JSON.stringify(orderId))
      .map(response => response.json());
  }

  patchBookingStatusToCargoClearingCustom(loginID,sessionID,orderId) {
    return this.http.patch(this.server_url + '/api resource name' + '/' + loginID + '/' + sessionID, JSON.stringify(orderId))
      .map(response => response.json());
  }

  patchBookingStatusToShipmentCompleted(loginID,sessionID,orderId) {
    return this.http.patch(this.server_url + '/api resource name' + '/' + loginID + '/' + sessionID, JSON.stringify(orderId))
      .map(response => response.json());
  }

  // Get order list based on container to generate CSV
  getOrderListCSV(loginID,sessionID,containerNo) {
    return this.http.get(this.server_url + '/OrderCSV' + '/' + loginID + '/' + sessionID + '/' + containerNo)
      .map(response => response.json());
  }

  sendUpdateSupplierBooking() {
    this.subject.next();
  }

  getUpdateSupplierBooking(): Observable<any> {
    return this.subject.asObservable();
  }

  //upload file in server
  uploadFile(FormData) {
    return this.http.post(this.server_url + "/UploadFile", FormData)
      .map(response => response.json());
  }

  // upload file for supplier
  uploadFileProfile(FormData) {
    return this.http.post(this.server_url + "/SupplierProfileUploadFile", FormData)
      .map(response => response.json());
  }

  // update quotation status to "deleted"
  deleteQuotation(loginID,sessionID,quotationId) {
    return this.http.patch(this.server_url + "/DeleteQuotation" + '/' + loginID + '/' + sessionID,  JSON.stringify(quotationId))
      .map(response => response.json());
  }

  // update quotation status from APPROVED to ACTIVE
  activateQuotation(loginID,sessionID,quotationId) {
    return this.http.patch(this.server_url + "/ActivateQuotation" + '/' + loginID + '/' + sessionID, JSON.stringify(quotationId))
      .map(response => response.json());
  }

  // update quotation status from DRAFT to PENDINGAPPROVAL
  requestConfirmation(loginID,sessionID,quotationId) {
    return this.http.patch(this.server_url + "/RequestForConfirmation" + '/' + loginID + '/' + sessionID, JSON.stringify(quotationId))
      .map(response => response.json());
  }

  // duplicate quotation on selected quotation by user
  duplicateQuotation(loginID,sessionID,quotationId) {
    return this.http.get(this.server_url + '/DuplicateQuotation' + '/' + loginID + '/' + sessionID + '/' + quotationId)
      .map(response => response.json());
  }

  // update quotation details based on quotation id
  modifyQuotation(loginID,sessionID,quotationId) {
    return this.http.patch(this.server_url + '/Quotation' + '/' + loginID + '/' + sessionID, JSON.stringify(quotationId))
    .map(response => response.json());
  }

  // get quotation details
  getQuotationData(loginID,sessionID,quotationId) {
    return this.http.get(this.server_url + '/Quotation' + '/' + loginID + '/' + sessionID + '/' + quotationId)
    .map(response => response.json());
  }

  sendQId(qId) {
    this.quotationId = qId;
    console.log("send qid", qId)
  }

  // uploadOrderListCSV(loginID,sessionID,orderList) {
  //   return this.http.patch(this.server_url + '/UploadOrderCsv' + '/' + loginID + '/' + sessionID , JSON.stringify(orderList))
  //   .map(response => response.json());
  // }

  getQId() {
    return this.quotationId;
  }

  sendUpdateQuotationList() {
    this.subject.next();
  }

  getUpdateQuotationList(): Observable<any> {
    return this.subject.asObservable();
  }

  // update container no based on container id
  updateContainerNo(loginID,sessionID,containerId) {
    return this.http.patch(this.server_url + "/SupplierAssignContainer" + '/' + loginID + '/' + sessionID,  JSON.stringify(containerId))
      .map(response => response.json());
  }

  downloadBuyerDocuments(loginID,sessionID,OrderId) {
    return this.http.get(this.server_url + '/CustomerCustomDocumentDownload' + '/' + loginID + '/' + sessionID + '/' + OrderId)
    .map(response => response.json());
  }

  // download uploaded quotation's file
  downloadFileUser(loginID,sessionID,quotationId) {
    return this.http.get(this.server_url + '/DownloadSupplierQuotation' + '/' + loginID + '/' + sessionID +'/' + quotationId)

  }

  // delete uploaded quotation's file
  removeFileUser(loginID,sessionID,quotationId) {
    return this.http.patch(this.server_url + '/DeleteFile' + '/' + loginID + '/' + sessionID, JSON.stringify({0: quotationId }))
  }

  // duplicate quotation on selected quotation by user
  getContainerList(loginID,sessionID,quotationId) {
    return this.http.get(this.server_url + '/SupplierContainerList' + '/' + loginID + '/' + sessionID + '/' + quotationId)
      .map(response => response.json());
  }

  // get the custom agent list to populate in the new quotation template
  getCustomAgentList(loginID,sessionID) {
    return this.http.get(this.server_url + '/CustomAgentList' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  // get filter information based on vessel id
  getListBasedOnVessel(loginID,sessionID,vesselID) {
    return this.http.get(this.server_url + '/SupplierVesselList' + '/' + loginID + '/' + sessionID + '/' + vesselID)
      .map(response => response.json());
  }

  // get list of vessel
  getVesselList(loginID,sessionID){
    return this.http.get(this.server_url + '/SupplierVessel' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());
  }

  getQuotationChargesBlock(loginID,sessionID,quotation_id) {
    return this.http.get(this.server_url + '/QuotationChargesBlock' + '/' + loginID + '/' + sessionID + '/' + quotation_id)
      .map(response => response.json());
  }

  getSeaFreightCharges(loginID,sessionID,quotation_id) {
    return this.http.get(this.server_url + '/QuotationChargesPartA' + '/' + loginID + '/' + sessionID + '/' + quotation_id)
      .map(response => response.json());
  }

  //upload file for supplier
  supplierUploadFile(FormData) {
    return this.http.post(this.server_url + "/UserUploadProfile", FormData)
      .map(response => response.json());
  }

  getSupplierPaymentRoutes(login_id, sessionID, month, country){
    return this.http.get(this.server_url + '/SupplierPaymentRoutes' + '/' + login_id + '/' + sessionID + '/' + month + '/' + country)
      .map(response => response.json());
  }

  getSupplierPaymentVessel(login_id, sessionID, route_id){
    return this.http.get(this.server_url + '/SupplierPaymentVessels' + '/' + login_id + '/' + sessionID + '/' + route_id)
      .map(response => response.json());
  }

  patchSupplierConfirmPayment(login_id,sessionID,confirmPayment){
    return this.http.patch(this.server_url + '/SupplierConfirmPayments' + '/' + login_id + '/' + sessionID, JSON.stringify(confirmPayment))
      .map(response => response);
  }

  // json for list of payment in payment list component
  getPaymentList() {
    return [

      {
        portName:'MYPKG, Port Klang, Malaysia - CNSHA, Shanghai, China', quotation_id:'0518_abc123_MY000006CH_CIF', container_share:'10', part_a:'1050.50', part_b:'500.00', total:'1550.50',
        custom:'', status:'Payment List Ready'
      },
      {
        portName:'MYPKG, Port Klang, Malaysia - CNSHA, Shanghai, China', quotation_id:'0718_supp_MY000009CH_CFR', container_share:'8', part_a:'1050.50', part_b:'500.00', total:'1550.50',
        custom:'', status:'Payment List Ready'
      },
      {
        portName:'CNSZX, Shenzhen Port, China - MYPNG, Penang, Malaysia', quotation_id:'0518_abc123_CH000001MY_FOB', container_share:'3', part_a:'1050.50', part_b:'500.00', total:'1550.50',
        custom:'', status:'Payment List Ready'
      },
      {
        portName:'CNSHA, Shanghai, China - USLBH, Long Beach, U.S.A', quotation_id:'0718_supp_CH000001US_DAF', container_share:'5', part_a:'1050.50', part_b:'500.00', total:'1550.50',
        custom:'', status:'Payment List Ready'
      },
      {
        portName:'CNSHA, Shanghai, China - USLBH, Long Beach, U.S.A', quotation_id:'0718_supp_CH000004US_CPT', container_share:'3', part_a:'1050.50', part_b:'500.00', total:'1550.50',
        custom:'', status:'Payment List Ready'
      },
      {
        portName:'AUSPW, Port Weld, Australia - MYPNG, Penang, Malaysia', quotation_id:'0518_abc123_AU000011MY_CIF', container_share:'7', part_a:'1050.50', part_b:'500.00', total:'1550.50',
        custom:'', status:'Payment List Ready'
      },
      {
        portName:'MYPNG, Penang, Malaysia - USLBH, Long Beach, U.S.A', quotation_id:'0518_abc123_MY000008US_FOB', container_share:'3', part_a:'1050.50', part_b:'500.00', total:'1550.50',
        custom:'', status:'Payment List Ready'
      }

    ];
  }
}
