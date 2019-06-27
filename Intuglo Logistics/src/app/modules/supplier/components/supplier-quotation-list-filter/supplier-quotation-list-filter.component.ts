import { Component, OnInit, Input, EventEmitter, Output, NgModule } from "@angular/core";
import { SupplierApiService } from "./../../services/supplier-api.service";
import { SessionStorage } from '../../../models/session-storage';
// import { UniquePipe } from './../../../unique.pipe';
import { SupplierSessionExpiredDialogComponent } from '../supplier-session-expired-dialog/supplier-session-expired-dialog.component';
import { MatDialog } from '@angular/material';
import { first } from "rxjs/operator/first";
@Component({
  selector: "supplier-quotation-list-filter",
  templateUrl: "./supplier-quotation-list-filter.component.html",
  styleUrls: ["./supplier-quotation-list-filter.component.css"]
})
// @NgModule({ declarations: [UniquePipe] })

export class SupplierQuotationListFilterComponent {
  @Output() shareVesselInfoToQuotationTable = new EventEmitter();
  @Input() countryId: String;
  supplierQuotations: any = [];
  supplierQuotationRoute: any = [];
  supplierQuotationVessel: any = [];
  supplierDetails: any[];
  sessionDetails: any[];
  rawJsonQuotationDetails: any[];
  selectedRoute;
  quotationVessel: any = [];
  session = new SessionStorage();  //Create instance of SessionStorage
  firstRoute;
  firstVessel;

  constructor(private service: SupplierApiService, public dialog: MatDialog) { }

  ngOnInit() {
    // route list
    this.service
      .getSupplierQuotationFilterList(this.session.loginID, this.session.sessionID)
      .subscribe(getQuotationInfo => {
        this.rawJsonQuotationDetails = getQuotationInfo;
        this.supplierQuotations = Object.values(this.rawJsonQuotationDetails);
        this.supplierQuotationRoute = this.supplierQuotations.filter(item => {
          return item.country === this.countryId;
        });
        this.firstRoute = this.supplierQuotationRoute[0].portName;
      },
      error => {
        if (error.status == 400) {
          this.dialog.open(SupplierSessionExpiredDialogComponent, { disableClose: true });
        }
      });

      // vessel list
      this.service
      .getSupplierQuotationFilterList(this.session.loginID, this.session.sessionID).subscribe(getVesselInfo => {
        this.rawJsonQuotationDetails = getVesselInfo;
        this.supplierQuotations = Object.values(this.rawJsonQuotationDetails);
        this.supplierQuotationVessel = this.supplierQuotations.filter(item => {
          return item.portName === this.firstRoute;
        });
        this.firstVessel = this.supplierQuotationVessel[0].vessel_id;
        this.shareVesselInfoToQuotationTable.emit(this.firstVessel);
      });

      // this.shareVesselInfoToQuotationTable.emit(this.firstVessel);
  }

  ngOnChanges() {
    // route list
    this.service
      .getSupplierQuotationFilterList(this.session.loginID, this.session.sessionID)
      .subscribe(getQuotationInfo => {
        this.rawJsonQuotationDetails = getQuotationInfo;
        this.supplierQuotations = Object.values(this.rawJsonQuotationDetails);
        this.supplierQuotationRoute = this.supplierQuotations.filter(item => {
          return item.country === this.countryId;
        });
        this.firstRoute = this.supplierQuotationRoute[0].portName;

        // vessel list
      this.service
      .getSupplierQuotationFilterList(this.session.loginID, this.session.sessionID).subscribe(getVesselInfo => {
        this.rawJsonQuotationDetails = getVesselInfo;
        this.supplierQuotations = Object.values(this.rawJsonQuotationDetails);
        this.supplierQuotationVessel = this.supplierQuotations.filter(item => {
          return item.portName === this.firstRoute;
        });
        this.firstVessel = this.supplierQuotationVessel[0].vessel_id;
        this.shareVesselInfoToQuotationTable.emit(this.firstVessel);
      });
      });

      // this.shareVesselInfoToQuotationTable.emit(this.firstVessel);
  }

  onSelectRoutes(port) {
    this.firstRoute = port;
    this.service
      .getSupplierQuotationFilterList(this.session.loginID, this.session.sessionID).subscribe(getVesselInfo => {
        this.rawJsonQuotationDetails = getVesselInfo;
        this.supplierQuotations = Object.values(this.rawJsonQuotationDetails);
        this.supplierQuotationVessel = this.supplierQuotations.filter(item => {
          return item.portName === this.firstRoute;
        });
        this.firstVessel = this.supplierQuotationVessel[0].vessel_id;
        this.shareVesselInfoToQuotationTable.emit(this.firstVessel);
      });
  }

  sendFilterInfo(vessel) {
    this.quotationVessel = vessel;
    this.shareVesselInfoToQuotationTable.emit(this.quotationVessel);
  }
}