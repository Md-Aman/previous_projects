
/////*****installed packages and required dependencies*****/////
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { APP_INITIALIZER,NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { NgxPaginationModule } from "ngx-pagination";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from '@angular/common/http';
import { Ng2CompleterModule } from "ng2-completer";
import { InvalidTooltipModule } from "ng-invalid-tooltip";
// import { NgxDatatableModule } from "@swimlane/ngx-datatable";
// import { DataTableModule } from "angular2-datatable";
// import { IonRangeSliderModule } from "ng2-ion-range-slider";
// import { TimezonePickerModule } from 'ng2-timezone-selector';
import { CurrencyMaskModule } from "ng2-currency-mask";

import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
// import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { CUSTOM_ERRORS } from "./modules/public/components/signup/custom-errors";
// import { MyDatePickerModule } from 'mydatepicker';

/////*****usage for popup modal*****/////
import { MatDialogModule } from "@angular/material/dialog";
import { MatCardModule, MatToolbarModule } from "@angular/material";
import { MatButtonModule } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BookingAccessComponent } from './modules/public/components/booking-access/booking-access.component';
import { AppComponent } from "./app.component";
import { signupComponent } from "./modules/public/components/signup/signup.component";
import { BookNowComponent } from "./modules/public/components/book-now/book-now.component";
import { LoginPopupComponent } from './modules/public/components/login-popup/login-popup.component';
import { AdminViewQuotationTemplateComponent } from './modules/admin/components/admin-view-quotation-template/admin-view-quotation-template.component';


/////*****usage for services*****/////
import { PublicApiService } from "./modules/public/services/public-api.service";
import { CustomerApiService } from "./modules/customer/services/customer-api.service";
import { SupplierApiService } from "./modules/supplier/services/supplier-api.service";
import { CustomAgentApiService } from "./modules/custom-agent/services/custom-agent-api.service";
import { SharedService } from "./modules/shared/services/shared.service";
import { ConfigService } from "./config/config.service";
import { AdminApiService } from "./modules/admin/services/admin-api.service";


/////*****usage for popup/modal in action buttons*****/////
import { ModalModule } from "ngx-modal";
import { MaterialModule } from './material.module';

import { SupplierAssignContainerComponent } from './modules/supplier/components/supplier-assign-container/supplier-assign-container.component';

import { MatExpansionModule } from "@angular/material/expansion";
import { UserOnboardComponent } from './modules/public/components/user-onboard/user-onboard.component';
import { ViewBookingComponent } from './modules/shared/view-booking/view-booking.component';import { CustomerSessionExpiredDialogComponent } from './modules/customer/components/customer-session-expired-dialog/customer-session-expired-dialog.component';
import { SupplierSessionExpiredDialogComponent } from './modules/supplier/components/supplier-session-expired-dialog/supplier-session-expired-dialog.component';
import { PapaParseModule } from 'ngx-papaparse';
import { AdminOrderNotificationTopMenuComponent } from './modules/admin/components/admin-order-notification-top-menu/admin-order-notification-top-menu.component';
import { AdminOrderNotificationActionButtonComponent } from './modules/admin/components/admin-order-notification-action-button/admin-order-notification-action-button.component';
import { ForgotPasswordComponent } from './modules/public/components/forgot-password/forgot-password.component';

import { CustomerShareModule } from './modules/customer/router-modules/customer-share.module';
import { SupplierShareModule } from './modules/supplier/router-modules/supplier-share.module';
import { AdminShareModule } from './modules/admin/router-modules/admin-share.module';




import { routeConfig } from './app-routing.module';
import { PackingListComponent } from './modules/customer/components/packing-list/packing-list.component';
import { CustomAgentPasswordPopupComponent } from './modules/custom-agent/components/custom-agent-password-popup/custom-agent-password-popup.component';
import { CustomAgentSessionExpiredDialogComponent } from './modules/custom-agent/components/custom-agent-session-expired-dialog/custom-agent-session-expired-dialog.component';
import { ForgetPasswordPopupComponent } from './modules/public/components/forget-password-popup/forget-password-popup.component';
import { ProfileUnapprovedPopupComponent } from './modules/shared/components/profile-unapproved-popup/profile-unapproved-popup.component';
import { PrintDateFormatPipe } from "./modules/shared/pipes/print-date-format.pipe";
import { NgxLoadingModule } from 'ngx-loading';

export function getEnvSettings(appLoadService: ConfigService) {
  return () => appLoadService.getEnvSettings();
}

@NgModule({
  declarations: [
    AppComponent,
    ForgotPasswordComponent,
    LoginPopupComponent,
    signupComponent,
    BookNowComponent,
    AdminViewQuotationTemplateComponent,
    UserOnboardComponent,
    ViewBookingComponent,
    SupplierAssignContainerComponent,
    CustomerSessionExpiredDialogComponent,
    SupplierSessionExpiredDialogComponent,
    AdminOrderNotificationTopMenuComponent,
    AdminOrderNotificationActionButtonComponent,
    PackingListComponent,
    CustomAgentPasswordPopupComponent,
    CustomAgentSessionExpiredDialogComponent,
    ForgetPasswordPopupComponent,
    ProfileUnapprovedPopupComponent,
    BookingAccessComponent,

 
    
  ],
  entryComponents: [
    LoginPopupComponent,
    BookNowComponent,
    signupComponent,
    CustomAgentPasswordPopupComponent,
    UserOnboardComponent,
    ViewBookingComponent,
    SupplierAssignContainerComponent,
    CustomerSessionExpiredDialogComponent,
    SupplierSessionExpiredDialogComponent,
    CustomAgentSessionExpiredDialogComponent,
    ForgotPasswordComponent,
    AdminViewQuotationTemplateComponent,
    PackingListComponent,
    ForgetPasswordPopupComponent,
    ProfileUnapprovedPopupComponent,
    BookingAccessComponent
  ],
  imports: [ 
    BrowserModule,
    CurrencyMaskModule,
    AngularFontAwesomeModule,
    // AppRoutingModule,
    // CustomerModule,
    // MyDatePickerModule,
    HttpModule,
    HttpClientModule,
    NgxPaginationModule,
    // HttpClientModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    // SidebarModule,
    MatToolbarModule,
    MatExpansionModule,
    // NgxDatatableModule,
    // DataTableModule,
    // MatCheckboxModule,
    Ng2CompleterModule,
    InvalidTooltipModule,
    ModalModule,
    // IonRangeSliderModule,
    // TimezonePickerModule,
    CommonModule,
    PapaParseModule,
    ToastrModule.forRoot(),
    NgBootstrapFormValidationModule.forRoot(CUSTOM_ERRORS),
    NgxLoadingModule.forRoot({}),
    // MyDatePickerModule,
    // Ng2AutoCompleteModule,
    CustomerShareModule,
    SupplierShareModule,
    AdminShareModule,
    RouterModule.forRoot(routeConfig)
      
  ],
  providers: [
    PublicApiService,
    CustomerApiService,
    SupplierApiService,
	  CustomAgentApiService,
    AdminApiService,
    SharedService,
    ConfigService,
    PrintDateFormatPipe,
    { provide: APP_INITIALIZER, useFactory: getEnvSettings, deps: [ConfigService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
