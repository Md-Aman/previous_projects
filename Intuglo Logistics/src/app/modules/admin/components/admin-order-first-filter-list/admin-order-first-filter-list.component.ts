import { AdminApiService } from './../../services/admin-api.service';
import { Component, OnInit, Input, EventEmitter, Output, NgModule } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SessionStorage } from '../../../models/session-storage';
import { UniquePipe } from './../../../unique.pipe';
import { IMyOptions, IMyDateModel } from "mydatepicker";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import * as moment from 'moment';
@Component({
  selector: 'admin-order-first-filter-list',
  templateUrl: './admin-order-first-filter-list.component.html',
  styleUrls: ['./admin-order-first-filter-list.component.css']
})

@NgModule({ declarations: [UniquePipe] })

export class AdminOrderFirstFilterListComponent implements OnInit {

  @Input() selectedRoute: String;
  @Output() shareVesselID = new EventEmitter();
  @Output() shareSupplierID = new EventEmitter();

  session = new SessionStorage();
  sessionDetails: any[];
  rawJsonBookingDetails: any[];
  adminBookings: any = [];
  adminBookingVessel: any = [];
  adminQuotationId: any = [];
  selectedQuotation: any= [];
  selectedVesselID;
  adminBooking: any = [];
  // todayDate;
  etd: any;
  eta: Date;
  filterList;
  supplierList;
  supplier_id;
  departDate:any;
  arrivalDate:any;
  firstPortFrom;
  firstPortTo;
  firstVessel;
  firstSupplier;
  shipmentCalendarHidden: boolean = true;
  selectedVesselFromCalendar: any;
  portsDepartureSource: any ;
  portsArrivalSource: any ;

  selectedDeparture: any;
  selectedArrival: any;
  changeEtd(etd) {
    this.etd = etd;
  }

  changeEta(eta) {
    this.eta = eta;
  }
// display the port dropdown
autocomplePortListFormatter = (data: any): SafeHtml => {
  let html = `<span>${data.port_name}</span>`;
  return this._sanitizer.bypassSecurityTrustHtml(html);
};
  constructor(
    private service: AdminApiService,
    public dialog:MatDialog,
    private _sanitizer: DomSanitizer
  ) {
    // this.todayDate = new Date();
   }
   toggleShipmentCalendar() {
     this.shipmentCalendarHidden = !this.shipmentCalendarHidden;
   }
  ngOnInit() {
    //get list of filter info based on selected route from country list component
    this.service.getAdminFilterListInfo(this.session.loginID,this.session.sessionID, this.selectedRoute)
    .subscribe(getBookingInfo => {
      this.filterList = getBookingInfo;
      this.firstPortFrom = this.filterList[0].port_name_departure; //set first array
      this.firstPortTo = this.filterList[0].port_name_arrival; //set first array
      this.firstVessel = this.filterList[0].vessel_no; //set first array
      this.eta = this.filterList[0].eta;
      this.etd = this.filterList[0].etd;
      this.setAutoCompleteArray(getBookingInfo);
      this.onClickSelectedVessel(this.firstVessel); // call function by passing parameter
      });
  }
  setAutoCompleteArray (info) {
    this.portsDepartureSource = info.departure;
      this.portsArrivalSource = info.arrival; 
  }
  // data coming form child componenet "shared/shipment-calendar"
  selectedVesselFromCalendarParent(events) {
    this.departDate = moment(events.viewDate).format('YYYY-MM-DD');
    this.setVesselData(events);
    this.onClickSelectedVessel(events.vessel_id, 'parent');
    this.shipmentCalendarHidden = true;
  }
  setVesselData(vessel) {
    this.firstPortFrom = vessel.port_name_departure; //set first array
    this.firstPortTo = vessel.port_name_arrival; //set first array
    this.firstVessel = vessel.vessel_no; //set first array
    this.eta = vessel.eta;
    this.etd = vessel.etd;
  }
  ngOnChanges(){
    // get list of filter info based on selected route from country list component
    if ( typeof this.selectedRoute != 'undefined' ) {
        this.service.getAdminFilterListInfo(this.session.loginID,
          this.session.sessionID, this.selectedRoute)
      .subscribe(getBookingInfo => {
        this.filterList = getBookingInfo;
        this.setAutoCompleteArray(getBookingInfo);
        // this.onClickSelectedVessel(this.firstVessel); //call function by passing parameter
      });
    }
    
  }
  
  //get supplier name based on selected vessel id
  onClickSelectedVessel(vessel, from = 'child' ){
    this.selectedVesselID = vessel;
    
    this.service.getAdminSupplierListInfo(this.session.loginID,
        this.session.sessionID, this.selectedVesselID)
      .subscribe( getCountryInfo => {
        this.supplierList = getCountryInfo;
        this.firstSupplier = this.supplierList[0].supplier_login_id;
        this.onClickSelectedSupplier(this.firstSupplier); //call function by passing parameter
      });
  }

  //get selected supplier
  onClickSelectedSupplier(supplier){
    this.supplier_id = supplier;
  }

  //share vessel id and supplier id to order list component
  onFilter(){
    this.shareVesselID.emit(this.selectedVesselID)
    this.shareSupplierID.emit(this.supplier_id)
  }

}
