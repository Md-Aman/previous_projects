import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { CalendarModule } from 'angular-calendar';

import { ProfileLogoUploaderComponent } from '@shared/components/profile-logo-uploader/profile-logo-uploader.component';
import {ShipmentCalendarComponent} from '@shared/components/shipment-calendar/shipment-calendar.component';
import { Ng2AutoCompleteModule } from "ng2-auto-complete";
import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import { NgxPayPalModule } from 'ngx-paypal';
import { PrintDateFormatPipe } from './../pipes/print-date-format.pipe';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  exports:[
    ProfileLogoUploaderComponent,
    ShipmentCalendarComponent,
    Ng2AutoCompleteModule,
    Ng2CarouselamosModule,
    NgxPayPalModule
  ],
  imports: [
    CommonModule,
    CalendarModule.forRoot(),
    Ng2AutoCompleteModule,
    Ng2CarouselamosModule,
    NgxPayPalModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [
    ProfileLogoUploaderComponent,
    ShipmentCalendarComponent,
    PrintDateFormatPipe
  ],
  providers: [DatePipe]
})
export class SharedModule { }
