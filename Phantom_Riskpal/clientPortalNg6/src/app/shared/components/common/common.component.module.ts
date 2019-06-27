import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SecureComponent } from '@app/layout/secure/secure.component';
import { PublicComponent } from '@app/layout/public/public.component';

import { SupplierFormComponent } from './../../../modules/supplier/supplier-form/supplier-form.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
// import { MaterialModule } from '../material.module';
import { NgxLoadingModule } from 'ngx-loading';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@app/core/header/header.component';
import { FooterComponent } from '@app/core/footer/footer.component';
import { SidenavComponent } from '@app/core/sidenav/sidenav.component';
import { BsDropdownModule, ModalModule  } from 'ngx-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SimpleTableComponent } from '../tables/simple-table/simple-table.component';
import { CollapsableTableComponent } from './../tables/collapsable-table/collapsable-table.component';
import { TabsModule, AccordionModule, TooltipModule, CarouselModule, RatingModule } from 'ngx-bootstrap';
import { MatDialogModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { InternationalPhoneModule } from 'ng4-intl-phone';
import { NgBootstrapFormValidationModule, CUSTOM_ERROR_MESSAGES } from 'ng-bootstrap-form-validation';
import { CUSTOM_ERRORS } from "@shared/services/response-handler/custom-errors";

import { BsDatepickerModule } from 'ngx-bootstrap';
import { UploadComponent } from '../upload/upload.component';
import { CountryProfileComponent } from './../../ra/country-profile/country-profile.component';
import { AssignQuestionModalComponent } from './../../ra/assign-question-modal/assign-question-modal.component';
import { SupplierComponent } from './../../ra/supplier/supplier.component';
import { SupplierCreateListModalComponent } from './../../ra/supplier-create-list-modal/supplier-create-list-modal.component';
import { CommunicationComponent } from './../../ra/communication/communication.component';
import { ContingencyComponent } from './../../ra/contingency/contingency.component';
import { AllQuestionsComponent } from './../../ra/all-questions/all-questions.component';

import { PersonalDetailsComponent } from '@app/modules/user/form/personal-details/personal-details.component';
import { CreateRpstaffComponent } from '@app/modules/user/rpstaff/create-rpstaff/create-rpstaff.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { CreateComponent as CreateRiskLabelComponent } from '@app/modules/manage-riskpal/risk-label/create/create.component';
import { CreateComponent as CreateRiskQuestionComponent } from '@app/modules/manage-riskpal/risk-question/create/create.component';

import { RpstaffComponent } from './../../../core/menus/rpstaff/rpstaff.component';
import { UserComponent } from './../../../core/menus/user/user.component';
import { EmergencyDetailsComponent } from './../../../modules/user/form/emergency-details/emergency-details.component';
import { MedicalInformationComponent } from './../../../modules/user/form/medical-information/medical-information.component';
import { TrainingInformationComponent } from './../../../modules/user/form/training-information/training-information.component';

@NgModule({
  declarations: [
    SecureComponent,
    PublicComponent,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    SimpleTableComponent,
    UploadComponent,
    CollapsableTableComponent,
    SupplierFormComponent,
    CountryProfileComponent,
    AssignQuestionModalComponent,
    SupplierComponent,
    SupplierCreateListModalComponent,
    CommunicationComponent,
    ContingencyComponent,
    PersonalDetailsComponent,
    EmergencyDetailsComponent,
    MedicalInformationComponent,
    TrainingInformationComponent,
    CreateRpstaffComponent,
    CreateRiskLabelComponent,
    CreateRiskQuestionComponent,
    AllQuestionsComponent,
    RpstaffComponent,
    UserComponent
  ],
  entryComponents:[
    AssignQuestionModalComponent,
    SupplierCreateListModalComponent,
    CreateRiskLabelComponent,
    CreateRiskQuestionComponent,
    AllQuestionsComponent
  ],
  imports: [
    RouterModule,
    FormsModule,
    HttpModule,
    FlexLayoutModule,
    ReactiveFormsModule ,
    NgxLoadingModule.forRoot({}),
    CommonModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    FontAwesomeModule,
    NgxDatatableModule,
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    CarouselModule.forRoot(),
    RatingModule.forRoot(),
    MatDialogModule,
    NgSelectModule,
    NgBootstrapFormValidationModule.forRoot(),
    NgBootstrapFormValidationModule,
    BsDatepickerModule.forRoot(),
    InternationalPhoneModule,
    NgxChartsModule,
    CKEditorModule

  ],
  exports: [
    CommonModule,
    SecureComponent,
    PublicComponent,
    // LoginComponent,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    FontAwesomeModule,
    NgxDatatableModule,
    SimpleTableComponent,
    CollapsableTableComponent,
    TabsModule,
    AccordionModule,
    TooltipModule,
    CarouselModule,
    RatingModule,
    NgxLoadingModule,
    MatDialogModule,
    NgSelectModule,
    NgBootstrapFormValidationModule,
    BsDatepickerModule,
    InternationalPhoneModule,
    UploadComponent,
    SupplierFormComponent,
    CountryProfileComponent,
    SupplierComponent,
    CommunicationComponent,
    ContingencyComponent,
    PersonalDetailsComponent,
    EmergencyDetailsComponent,
    MedicalInformationComponent,
    TrainingInformationComponent,
    CreateRpstaffComponent,
    CKEditorModule,
    NgxChartsModule,
    CreateRiskLabelComponent,
    CreateRiskQuestionComponent,
    AllQuestionsComponent,
    RpstaffComponent,
    UserComponent
  ],
  providers: [{
    provide: CUSTOM_ERROR_MESSAGES,
    useValue: CUSTOM_ERRORS,
    multi: true
  }]
})
export class CommonComponentModule { }
