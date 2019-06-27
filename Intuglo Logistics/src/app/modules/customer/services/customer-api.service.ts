import { ConfigService } from "../../../config/config.service";
import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { AppComponent } from "./../../../app.component";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class CustomerApiService {
 
  
  sessionExpired:boolean=false;

  constructor(private http: Http,private configService:ConfigService) {}

  private subject = new Subject<any>();

  private server_url = this.configService.server_url;


  // get list of booking information
  getCustomerBookings(loginID,sessionID) {
    return this.http.get(this.server_url + '/CustomerBookingList' + '/' + loginID + '/' + sessionID)
      .map(response => response.json());    
  }

  // get list of hs code information
  getHSWikiList(){
    return this.http.get(this.server_url + '/UsersViewHsWiki')
      .map(response => response.json());
  }
  
  patchActivateAccount(tokenID){
    return this.http.patch(this.server_url + '/ActivateAccount', JSON.stringify(tokenID))
    .map(response => response.json());
  }


  // patchBookingStatus(loginID,sessionID,orderIdAndOrderStatusCode){
  //   return this.http.patch(this.server_url + '/ChangeBookingStatus' + '/' + loginID + '/' + sessionID,JSON.stringify(orderIdAndOrderStatusCode))
  //   .map(response => response);
  // }

  // update order status to "ordercancelled"
  // patchBookingStatusToCancel(loginID,sessionID,orderId){
  //   return this.http.patch(this.server_url + '/ChangeBookingStatusToCancel' + '/' + loginID + '/' + sessionID,JSON.stringify(orderId))
  //   .map(response => response.json());
  // }

  // update order status to "cargoreadyforpickup"
  // patchBookingStatusToCargoReadyforPickup(loginID,sessionID,orderId){
  //   return this.http.patch(this.server_url + '/ChangeBookingStatusToCargoReadyforPickup' + '/' + loginID + '/' + sessionID,JSON.stringify(orderId))
  //   .map(response => response.json());
  // }

  // patchBookingStatusToApproveCreditBlock(loginID,sessionID,orderId){
  //   return this.http.patch(this.server_url + '/ChangeBookingStatusToApproveCreditBlock' + '/' + loginID + '/' + sessionID,JSON.stringify(orderId))
  //   .map(response => response.json());
  // }

  // get list of country
  getCountryList(loginID,sessionID){
    return this.http.get(this.server_url + '/CustomerCountryList' + '/' + loginID + '/' + sessionID)
    .map(response => response.json());
  }

  // update customer's profile information
  updateCustomerProfile(loginID,sessionID, customerProfileData){
    return this.http.patch(this.server_url + '/CustomerProfile' + '/' + loginID + '/' + sessionID,JSON.stringify(customerProfileData))
    .map(response => response.json());
  }

  // get customer's information
  getCustomerProfile(loginID,sessionID){
    return this.http.get(this.server_url + '/CustomerProfile' + '/' + loginID + '/' + sessionID)
    .map(response => response.json());
  }


   sendUpdateCustomerBooking() {
      this.subject.next({});
    }
    getUpdateCustomerBooking(): Observable<any> {
      return this.subject.asObservable();
    }

    // get list of businesses
    getBusinessIndustry(loginID,sessionID){
      return this.http.get(this.server_url + '/CustomerProfileInit' + '/' + loginID + '/' + sessionID)
    .map(response => response.json());
    }

    getCustomerInvoiceDetails(loginID,sessionID){
      return this.http.get(this.server_url + '/CustomerInvoiceInit' + '/' + loginID + '/' + sessionID)
    .map(response => response.json());
    }

    // get list of booking in carts
    getCartList(loginID,sessionID,cartID){
      return this.http.get(this.server_url + '/CartList' + '/' + loginID + '/' + sessionID+ '/' + cartID)
      .map(response => response);
    // .map(response => response.json());
    }
    confirmContianerSpace( loginID, sessionID, cartID ) {
      return this.http.get(this.server_url + '/EnterPaymentGateway' + '/' + loginID + '/' + 
        sessionID+ '/' + cartID);
    }
    uploadFile(FormData) {
      return this.http.post(this.server_url + "/CustomerProfileUploadFile", FormData)
        .map(response => response.json());
    }

    // update order status in cart to "deleted"
    updateCartStatusDeleted(loginID,sessionID,cartItemId) {
      return this.http.patch(this.server_url + "/UpdateCartStatus" + '/' + loginID + '/' + sessionID,  JSON.stringify(cartItemId))
        .map(response => response.json());
    }

    // update order status in cart to "paid"
    updateCartStatusPaid(loginID,sessionID, cartId) {
      return this.http.patch(this.server_url + "/CartPaymentCheckout" + '/' + loginID + '/' + sessionID + '/' + cartId.carts_id,  JSON.stringify(cartId))
        .map(response => response.json());
    }
    
    // update container's number of people share, remaining cbm and halal_status
    // updateContainer(loginID,sessionID,orderList) {
    //   return this.http.patch(this.server_url + "/UserUpdateContainer" + '/' + loginID + '/' + sessionID,  JSON.stringify(orderList))
    //     .map(response => response.json());
    // }

    sendUpdateCartList() {
      this.subject.next({});
    }

    getUpdateCartList(): Observable<any> {
      return this.subject.asObservable();
    }

    // get list of custom documents
    getDocuments(loginID,sessionID,orderId){
      return this.http.get(this.server_url + "/CustomerCustomeFile"+ '/' + loginID + '/' + sessionID + '/' + orderId)
      .map(response => response.json());
    }

    // upload custom file
    uploadOrderDocument(fileAndDocumentDescription) {
      return this.http.post(this.server_url + "/CustomerUploadCustomFile", fileAndDocumentDescription)
        .map(response => response.json());
    }

    //upload file for customer
    customerUploadFile(FormData) {
      return this.http.post(this.server_url + "/UserUploadProfile", FormData)
        .map(response => response.json());
    }

    // delete custom file in server
    deleteOrderDocument(loginID,sessionID,documentDetails){
      return this.http.patch(this.server_url + "/CustomerCustomeFile"+ '/' + loginID + '/' + sessionID, JSON.stringify(documentDetails))
        .map(response => response.json());
    }
	  
}
