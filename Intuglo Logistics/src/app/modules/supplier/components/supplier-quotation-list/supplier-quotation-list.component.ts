import { Component, Output, EventEmitter, Input, OnInit, NgModule } from '@angular/core';
import { GroupByPipe } from './../../../group-by.pipe';
import { SupplierApiService } from './../../services/supplier-api.service';
import { Router } from '@angular/router';
import { SessionStorage } from '../../../models/session-storage';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'supplier-quotation-list',
  templateUrl: './supplier-quotation-list.component.html',
  styleUrls: ['./supplier-quotation-list.component.css']
})
@NgModule({
  declarations: [ GroupByPipe ]
})
export class SupplierQuotationListComponent implements OnInit {  
  @Output() shareCheckBoxBooleanValueToQuotationDashboard = new EventEmitter();
  @Output() shareQuotationStatus = new EventEmitter();
  @Input() filterVesselFromQuotation;
  @Output() shareQuotationIdToQuotationDashboard = new EventEmitter();
  subscription: Subscription;

  count : number = 0;
  isChecked : boolean ;
  select: boolean;
  selectedAll: any;
  checkbox_length: number;

  supplierQuotations:any = [];
  supplierQuotationSea:any = [];
  supplierQuotationAir:any = [];
  sea:any = "1";
  air:any = "2";
  supplierDetails: any[];
  sessionDetails: any[];
  rawJsonQuotationDetails: any[];
  //Create instance of SessionStorage
  session = new SessionStorage();

  constructor(private service:SupplierApiService, private router: Router) {
    this.subscription = this.service.getUpdateQuotationList().subscribe(details => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    // getting supplier session from login
    // this.supplierDetails = JSON.parse(sessionStorage.getItem("supplier-session"))
    // this.sessionDetails = Object.values(this.supplierDetails);

    this.service.getSupplierQuotation(this.session.loginID,this.session.sessionID)
      .subscribe( getQuotationInfo => {
            this.rawJsonQuotationDetails = getQuotationInfo;
            this.supplierQuotations = Object.values(this.rawJsonQuotationDetails);
            this.supplierQuotationSea = this.supplierQuotations.filter(x =>(x.freight == this.sea && x.vessel_id == this.filterVesselFromQuotation))
            this.supplierQuotationAir = this.supplierQuotations.filter(x =>(x.freight == this.air && x.vessel_id == this.filterVesselFromQuotation))
      });
  }

  ngOnChanges(){
    this.service.getSupplierQuotation(this.session.loginID,this.session.sessionID)
      .subscribe( getQuotationInfo => {
            this.rawJsonQuotationDetails = getQuotationInfo;
            this.supplierQuotations = Object.values(this.rawJsonQuotationDetails);
            this.supplierQuotationSea = this.supplierQuotations.filter(x =>(x.freight == this.sea && x.vessel_id == this.filterVesselFromQuotation))
            this.supplierQuotationAir = this.supplierQuotations.filter(x =>(x.freight == this.air && x.vessel_id == this.filterVesselFromQuotation))
      });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  selectSeaQuotationSea(position,supplierQuotationSea,supplierQuotationAir){
    supplierQuotationAir.forEach(function(item,value){
      item.checked = false;
    })
    supplierQuotationSea.forEach(function (item, index) {
      if (position != index) {
        item.checked = false;
      }
    });
  
  }

  selectSeaQuotationAir(position,supplierQuotationAir,supplierQuotationSea){
    supplierQuotationSea.forEach(function(item,value){
      item.checked = false;
    })
    supplierQuotationAir.forEach(function (item, index) {
      if (position != index) {
        item.checked = false;
      }
    });
  }

  getQuotationId(event, item) {

    if (event.target.checked) {
      this.shareCheckBoxBooleanValueToQuotationDashboard.emit(true);
      this.service.quotationId = item.quotation_id;
      this.shareQuotationStatus.emit(item.quotationStatus);
    } else {
      this.shareCheckBoxBooleanValueToQuotationDashboard.emit(false);
    }
  }
}