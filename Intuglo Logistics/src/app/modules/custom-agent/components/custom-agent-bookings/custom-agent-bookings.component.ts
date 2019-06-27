import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SessionStorage } from '../../../models/session-storage';
import { CustomAgentApiService } from './../../services/custom-agent-api.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'custom-agent-bookings',
  templateUrl: './custom-agent-bookings.component.html',
  styleUrls: ['./custom-agent-bookings.component.css']
})
export class CustomAgentBookingsComponent implements OnInit {
  @Input() route: String;
  @Output() shareIsCheckedChecboxToDashboard = new EventEmitter<{
     isChechedCheckBox: boolean, 
     isDocumentLength: boolean,
     customStatus: string 
    }>();
  session = new SessionStorage();
  subscription: Subscription;

  splitRoute: any;
  departureCountryCode: string;
  arrivalCountryCode: string;
  routeDetails: any[];
  isDocument: boolean = true;

  routeInfo: any[];
  quotationID: string;

  constructor(private customAgentApiService: CustomAgentApiService) {
    this.subscription = this.customAgentApiService.getUpdateAdminBooking().subscribe(details => {
      this.ngOnChanges();
    });
  }


  ngOnChanges() {
    if (this.route) {
      this.splitRoute = this.route.split("-")
      this.departureCountryCode = this.splitRoute[0];
      this.arrivalCountryCode = this.splitRoute[1];


      this.customAgentApiService.getCustomAgentRouteDetails(this.session.loginID, this.session.sessionID, this.departureCountryCode, this.arrivalCountryCode)
        .subscribe(getRouteDetails => {
          this.routeDetails = getRouteDetails;
          return this.routeDetails;
        });
    }

  }
  ngOnInit() {
  }
  selectOneCheckBox(position, orders, routeDetails) {
    routeDetails.forEach(function (routeItems, value) {
      routeItems.order.forEach(function (booking, index) {
        booking.checked = false;
      })
    })
    orders.forEach(function (booking, index) {
      if (position == index) {
        booking.checked = true;
      } 
    });
  }

  getOrderDetails(event, orderId, documentList, cargoStatusCode, customStatusCode) {
    if (event.target.checked) {
      if (documentList == null) {
        this.isDocument = false;
      } else {
        this.isDocument = true;
      }
      this.shareIsCheckedChecboxToDashboard.emit({ 
        isChechedCheckBox: true, 
        isDocumentLength: this.isDocument,
        customStatus: customStatusCode
      });
      this.customAgentApiService.orderId = orderId;
      this.customAgentApiService.cargoStatusCode = cargoStatusCode;
      this.customAgentApiService.customStatusCode = customStatusCode;
    } else {
      this.shareIsCheckedChecboxToDashboard.emit({ 
        isChechedCheckBox: false, 
        isDocumentLength: false,
        customStatus: customStatusCode
      });
    }
  }
}
