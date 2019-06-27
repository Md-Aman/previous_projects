import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { isNgTemplate } from '@angular/compiler';
import { SupplierApiService } from "./../../services/supplier-api.service";
import { SessionStorage } from '../../../models/session-storage';
import { SupplierSessionExpiredDialogComponent } from '../supplier-session-expired-dialog/supplier-session-expired-dialog.component';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
@Component({
  selector: 'supplier-list-filter',
  templateUrl: './supplier-list-filter.component.html',
  styleUrls: ['./supplier-list-filter.component.css']
})
export class SupplierListFilterComponent implements OnInit {
  @Input() selectedCountry: String;
  // @Output() shareQuotationIdToSupplierBookings = new EventEmitter();
  @Output() shareQIdToPagination = new EventEmitter();
  session = new SessionStorage();
  
  supplierDetails: any[];
  sessionDetails: any[];
  rawJsonBookingDetails: any[];
  supplierBookings: any = [];
  supplierBookingVessel: any = [];
  supplierQuotationId: any = [];
  selectedQuotation: any= [];
  supplierBooking: any = [];
  firstVessel;
  firstQuotation;

  constructor(private service: SupplierApiService, public dialog:MatDialog) { 
  }

 ngOnInit() {
   
  
    //  this.service
    //   .getSupplierBookingFilterList(this.session.loginID,this.session.sessionID).
    //     subscribe(getVesselInfo => {
    //     this.rawJsonBookingDetails = getVesselInfo;
    //     this.supplierBookings = Object.values(this.rawJsonBookingDetails);
    //     this.supplierQuotationId = this.supplierBookings.filter(item => {
    //       return item.vessel_id === this.firstVessel;
    //     });
    //   this.firstQuotation = this.supplierQuotationId[0].quotation_id;
    //   // this.shareQuotationIdToSupplierBookings.emit(this.firstQuotation);
    //   this.shareQIdToPagination.emit(this.firstQuotation);
    // });
 }
 getSupplierBookingFilterList() {
  this.service
  .getSupplierBookingFilterList(this.session.loginID,this.session.sessionID)
  .subscribe(getBookingInfo => {
    this.rawJsonBookingDetails = getBookingInfo;
    const vesselsList = _.uniqBy(this.rawJsonBookingDetails, 'vessel_id');
    this.supplierBookings = Object.values(this.rawJsonBookingDetails);
    this.supplierBookingVessel = vesselsList.filter(item => {
      return item.country === this.selectedCountry;
    });
    this.firstVessel = this.supplierBookingVessel[0].vessel_id;
    this.supplierQuotationId = this.supplierBookings.filter(item => {
     return item.vessel_id === this.firstVessel;
   });
   this.firstQuotation = this.supplierQuotationId[0].quotation_id;
   this.shareQIdToPagination.emit(this.firstQuotation);
  },
  error=>{
    if(error.status == 400){
      this.dialog.open(SupplierSessionExpiredDialogComponent,{disableClose: true});
    }
   });
 }
  ngOnChanges() {
    this.getSupplierBookingFilterList();
  }

  onSelectVessels(vessel) {

    this.supplierQuotationId = this.supplierBookings.filter(item => {
        return item.vessel_id == vessel;
    });
    
    // console.log(vessel)
    // this.firstVessel = vessel;
    // this.service
    //   .getSupplierBookingFilterList(this.session.loginID,this.session.sessionID).subscribe(getVesselInfo => {
    //     this.rawJsonBookingDetails = getVesselInfo;
    //     this.supplierBookings = Object.values(this.rawJsonBookingDetails);
    //     console.log('this.', this.supplierBookings, '--', this.firstVessel);
    //     this.supplierQuotationId = this.supplierBookings.filter(item => {
    //       return item.vessel_id === this.firstVessel;
    //   });
    // });
  } 
  
  // onSelectQuotations(q_id) {
  //   this.selectedQuotation = this.getQuotationById(q_id);
  //   console.log(this.selectedQuotation)
  // }
 
  getQuotationById(quotationId){
    // console.log(quotationId)
    this.firstQuotation = quotationId;
    // this.shareQuotationIdToSupplierBookings.emit(this.firstQuotation);
    this.shareQIdToPagination.emit(this.firstQuotation);

    this.service
      .getSupplierBookingFilterList(this.session.loginID,this.session.sessionID)
      .subscribe(getBookingInfo => {
        this.rawJsonBookingDetails = getBookingInfo;
        this.supplierBooking = Object.values(this.rawJsonBookingDetails);
        this.supplierBookings = this.supplierBooking.filter(item => {
          return item.country === this.selectedQuotation;
        });
      });
  }
}