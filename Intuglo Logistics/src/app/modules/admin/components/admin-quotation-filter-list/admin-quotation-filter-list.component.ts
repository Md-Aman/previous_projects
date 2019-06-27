import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdminApiService } from './../../services/admin-api.service';
import { Subscription } from 'rxjs/Subscription';
import { SessionStorage } from '../../../models/session-storage';
import { IMyDpOptions } from "mydatepicker";
import { IMyOptions, IMyDateModel } from "mydatepicker";
import * as moment from "moment";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'admin-quotation-filter-list',
  templateUrl: './admin-quotation-filter-list.component.html',
  styleUrls: ['./admin-quotation-filter-list.component.css']
})
export class AdminQuotationFilterListComponent implements OnInit {
  @Input() selectedRoute;
  @Output() shareVesselId = new EventEmitter();
  session = new SessionStorage();

  // todayDate;
  etd: any;
  eta: any;
  filterList;
  departDate: any;
  arrivalDate: any;
  firstPortFrom;
  firstPortTo;
  firstVessel;
  selectedVessel: any;
  passVessel: any;

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
  constructor(private adminApiService:AdminApiService,
    private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    // get filter list info based on selected route
    // this.adminApiService.getAdminFilterListInfo(
    //     this.session.loginID,
    //     this.session.sessionID, 
    //     this.selectedRoute)
    //   .subscribe( getFilterInfo => {
    //         this.filterList = getFilterInfo;
    //         console.log('this.filterlisttt', this.filterList);
    //         this.findVessels(this.filterList[0]);
    //         this.firstPortFrom = this.filterList[0].port_name_departure; //set first array
    //         this.firstPortTo = this.filterList[0].port_name_arrival; //set first array
    //         this.firstVessel = this.filterList[0].vessel_id; //set first array
            
    //        console.log('arival', this.departDate);
    //         this.shareVesselId.emit(this.firstVessel); //share first array of vessel id to quotation list component
    //   });
  }
  toggleShipmentCalendar() {
    this.shipmentCalendarHidden = !this.shipmentCalendarHidden;
  }
  findVessels(vesselNo) {
    const vessel = this.filterList.find(item => {
      return item.vessel_id == vesselNo;
    });
    if ( vessel ) {
      this.firstPortFrom = vessel.port_name_departure;  //set first array
      this.firstPortTo = vessel.port_name_arrival; //set first array
      this.firstVessel = vessel.vessel_id; //set first array
      this.etd = vessel.etd;
      this.eta = vessel.eta;
      this.shareVesselId.emit(this.firstVessel); 
    } else {
      this.firstPortFrom = null;  //set first array
      this.firstPortTo = null; //set first array
      this.firstVessel = null; //set first array
      this.etd = null;
      this.eta = null;
      // this.shareVesselId.emit(this.firstVessel); 
    }
   
    
  }
  setAutoCompleteArray (info) {
    this.portsDepartureSource = info.departure;
      this.portsArrivalSource = info.arrival; 
  }
   // data coming form child componenet "shared/shipment-calendar"
   selectedVesselFromCalendarParent(events) {
    this.departDate = moment(events.viewDate).format('YYYY-MM-DD');
    this.setVesselData(events);
    this.shipmentCalendarHidden = true;
    //this.shareVesselId.emit(events.vessel_id);
    this.passVessel = events.vessel_id;

  }

  getQuotationList(){
    this.shareVesselId.emit(this.passVessel);
  }

  setVesselData(vessel) {
    this.firstPortFrom = vessel.port_name_departure; //set first array
    this.firstPortTo = vessel.port_name_arrival; //set first array
    this.firstVessel = vessel.vessel_no; //set first array
    this.eta = vessel.eta;
    this.etd = vessel.etd;
  }
  ngOnChanges() {
    if ( typeof this.selectedRoute != 'undefined' ) {
      // get filter list info based on selected route
    this.adminApiService.getAdminFilterListInfo(this.session.loginID,
      this.session.sessionID, 
      this.selectedRoute)
    .subscribe( getFilterInfo => {
          this.filterList = getFilterInfo;
          console.log('ngonchagne filter list', getFilterInfo);
          if ( getFilterInfo ) {
            // this.firstPortFrom = this.filterList[0].port_name_departure;  //set first array
            // this.firstPortTo = this.filterList[0].port_name_arrival; //set first array
            // this.firstVessel = this.filterList[0].vessel_id; //set first array
            // const etd = moment(this.filterList[0].etd, 'YYYY/MM/DD');
            // this.etd = this.filterList[0].etd;
            // this.departDate = { date: { year: etd.format('YYYY'), 
            //     month: etd.format('M'), day: etd.format('D') } } ;
          
            // const arrivalDate = moment(this.filterList[0].eta, 'YYYY/MM/DD');
            // this.eta = this.filterList[0].eta;
            // this.arrivalDate = { date: { year: arrivalDate.format('YYYY'), 
            //     month: arrivalDate.format('M'), day: arrivalDate.format('D') } } ;
            this.setAutoCompleteArray(getFilterInfo);
            // this.shareVesselId.emit(this.firstVessel); //share first array of vessel id to quotation list component
            
          }
          
    });
    }
    
  }

  // start functions for date picker
  public mytime: Date = new Date();
  currentYear: any = this.mytime.getUTCFullYear();
  currentDate: any = this.mytime.getUTCDate();
  currentMonth: any = this.mytime.getUTCMonth() + 1; //months from 1-12

  public myStartDateOptions: IMyOptions = {
    dateFormat: "dd/mm/yyyy",    
    // disableUntil: {year: this.currentYear, month: this.currentMonth, day: this.currentDate}
  };

  public myEndDateOptions: IMyOptions = {
    dateFormat: "dd/mm/yyyy",
    disableUntil: { year: 0, month: 0, day: 0 }
  };

  public onStartDateChanged(event: IMyDateModel) {
    if (!event.jsdate) {
      return;
    }

    let d: Date = new Date(event.jsdate.getTime());

    // set previous of selected date
    d.setDate(d.getDate());

    // Get new copy of options in order the date picker detect change
    let copy: IMyOptions = this.getCopyOfOptions();
    copy.disableUntil = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate()
    };
    this.myEndDateOptions = copy;
  }

  // Returns copy of myStartDateOptions
  getCopyOfOptions(): IMyOptions {
    return JSON.parse(JSON.stringify(this.myStartDateOptions));
  }

  public onEndDateChanged(event: IMyDateModel) {
    if (!event.jsdate) {
      return;
    }

    let d: Date = new Date(event.jsdate.getTime());

    // set next of selected date
    d.setDate(d.getDate() + 1);

    // Get new copy of options in order the date picker detect change
    let copy: IMyOptions = this.getCopyOfEndOptions(this.myStartDateOptions);
    copy.disableSince = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate()
    };
    this.myStartDateOptions = copy;
  }

  public getCopyOfEndOptions(options): IMyOptions {
    return JSON.parse(JSON.stringify(options));
  }

  // send vessel to quotation list component
  onSelectVessel(vessel){
    this.findVessels(vessel);
    this.shareVesselId.emit(vessel); //share selected vessel id to quotation list component
  }

}
