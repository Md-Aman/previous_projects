import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Http } from "@angular/http";
import { ConfigService } from "../../../../config/config.service";
import {ToastrService} from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Injectable()
export class ShipmentCalendar  {

  constructor(private http: Http, private configService: ConfigService
          , private toastr: ToastrService, private datePipe: DatePipe) { 
  }

  private server_url = this.configService.server_url;

  getVessels(date, type, departurePortTerminal, arrivalPortTerminal, searchType){
    
    return this.http.get(this.server_url + '/CalendarVesselList?type=' + type + '&date=' + date 
        + '&departurePortTerminal=' + departurePortTerminal + '&arrivalPortTerminal=' 
          + arrivalPortTerminal + '&searchType=' + searchType )
            .map((res) => (
              res.json()
           ))
  }

  toggleToaster(msg, type) {
    if ( type == 'error' ) {
      this.toastr.error(
        msg,
        "Unsuccessful!",
        {
          closeButton: true,
          progressBar: true,
          progressAnimation: "increasing",
          positionClass: "toast-top-right"
        }
      );
    } else {
      this.toastr.success(
        msg,
        "Successful!",
        {
          closeButton: true,
          progressBar: true,
          progressAnimation: "increasing",
          positionClass: "toast-top-right"
        }
      );
    }
  }

}
