import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay
} from 'angular-calendar';
import {DatePipe} from "@angular/common"
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: "#FFFFFF",
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};
import {ShipmentCalendar} from './shipment-calendar.service';
@Component({
  selector: 'shipment-calendar',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shipment-calendar.component.html',
  styleUrls: ['./shipment-calendar.component.css'],
  providers:[ShipmentCalendar]
})
export class ShipmentCalendarComponent implements OnInit, AfterViewInit, OnChanges   {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @Input () fromPage: string;
  @Input () departurePortTerminal: any;
  @Input () arrivalPortTerminal: any;
  @Input () selectedVesselFromCalendar: any;
  @Input () hiddenChanges: any;
  @Output () selectedVesselFromCalendarChange = new EventEmitter();
  view: string = 'month';
  searchType: string = 'landingPage'; // showing it for landing page by default
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  constructor(private shipmentService: ShipmentCalendar, private datePipe: DatePipe) {
    
    
  }
  ngOnInit() {
    
    this.getAllVessels(this.viewDate);
  }

  ngOnChanges(changes: SimpleChanges) {
    // when click on ETD text to display shipment calendar then call api
    if ( !this.hiddenChanges ) {
      this.getAllVessels(this.viewDate);
    }
    console.log('hidden', this.hiddenChanges);
    console.log('changes', changes.prop);
  }
  
  ngAfterViewInit() {
    // this.removeFullWeekdaysName();
  }
  removeFullWeekdaysName() {
    var week = document.querySelectorAll('.cal-header .cal-cell');
    for (var i = 0; i < week.length; i++){ 
      var fullWeek = week[i].innerHTML; 
      week[i].innerHTML = fullWeek.trim().slice(0,2);
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }
 
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }
  events: CalendarEvent[] = [ ];

  activeDayIsOpen: boolean = false;
  vessels: any = [];

  /**
   * get all vessels in month or day
   * @params date and type i.e Month or Day
   * @return array
   */
  getAllVessels(date, type = 'Month') {
    let departurePortTerminalPortId = 0;
    let arrivalPortTerminalPortId = 0;
    let callApi = true;
    console.log('from page', this.fromPage);
    if ( typeof this.fromPage != 'undefined' || this.fromPage == 'adminOrderList' ) {
        this.searchType = 'departureAndArrival';
        try {
          departurePortTerminalPortId = this.departurePortTerminal.port_id;
          arrivalPortTerminalPortId = this.arrivalPortTerminal.port_id;
          console.log('dep', departurePortTerminalPortId);
          if ( typeof departurePortTerminalPortId == 'undefined' 
              && typeof arrivalPortTerminalPortId == 'undefined' && !this.hiddenChanges )
          {
            callApi = false;
            this.vessels = [];
          }
        } catch (error) {
          this.vessels = [];
          callApi = false;
        }
        
    }
    this.vessels = [];
    // get record based on month or day
    const dateFormat = (type == 'Month') ? this.datePipe.transform(this.viewDate, 'yyyy-MM') 
              : this.datePipe.transform(this.viewDate, 'yyyy-MM-dd') ;
    if ( callApi ) {
      this.shipmentService.getVessels(
        dateFormat, type, 
        departurePortTerminalPortId, 
        arrivalPortTerminalPortId,
        this.searchType
      ).subscribe(
        data => {
          if ( data.length > 0 ) {         
            this.events = data.map(item => {
              return {
                start: new Date(item.etd),
                end: new Date(item.etd),
                title: item.port_name_arrival,
                eta: item.eta,
                etd: item.etd,
                port_name_arrival: item.port_name_arrival,
                port_name_departure: item.port_name_departure,
                vessel_no: item.vessel_no,
                vessel_id: item.vessel_id
              }
            });
          } else {
            //this.shipmentService.toggleToaster('No record found', 'error');
          }
        },
        error => {
          const msg = error.message;
          //this.shipmentService.toggleToaster(msg, 'error');
        }
      )
    }
    
  }
  monthChanged(date) {
    // setTimeout(() => {this.removeFullWeekdaysName()},30);
    this.getAllVessels(date);
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.viewDate = date;
    this.vessels = events;
    // setTimeout(() => {this.removeFullWeekdaysName()},30);
  }
  selectVesselForParent(vessel) {
    this.selectedVesselFromCalendar = vessel;
    vessel.viewDate = this.viewDate;
    this.selectedVesselFromCalendarChange.emit(vessel);
    document.getElementById('todayCalendar').click();
    
  }
  // beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
  //   document.getElementById('todayCalendar').click();
  //   // setTimeout(() => {this.removeFullWeekdaysName()},30);
  // }
}
