import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RaTemplateService } from './../../../modules/ra-template/service/ra-template.service';
import { ConstantType } from './../../../core/services/constant.type';
import { RaService } from './../service/ra.service';
import { AuthService } from './../../../core/guards/auth.service';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { RiskAssessmentService } from './../../../modules/ra/service/risk-assessment.service';
import { DEFAULT_SCROLL_TIME } from '@angular/cdk/scrolling';
import { ErrorMessage } from "ng-bootstrap-form-validation";


@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.scss']
})
export class CommunicationComponent implements OnInit {
  communicationForm: FormGroup;
  public loading = false;

  constructor(
    public raTemplateService: RaTemplateService,
    private raService: RaService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private responseService: ResponseService,
    private riskAssessmentService: RiskAssessmentService,
    private authService: AuthService,
    private formBuilder: FormBuilder, ) { }

  maxLocalNumberLimitReached: Boolean = false;
  maxLocalEmergencyLimitReached: Boolean = false;
  timezoneArray: any = [];
  numberOfCheckInArray: any = [];
  callInTime = [];
  communicationId: string;
  checkInNumber: number;
  // isShareInfo:boolean = false;
  templateId: string;
  raId: string;

  country  = 'gb';
  isCheckInTelephone: boolean = false;
  isEmgTelephone: boolean = false;
  isLocalTelephone: boolean = false;


  geolocationPosition:any;


  customErrorMessages: ErrorMessage[] = [
    {
      error: 'pattern',
      format: (label, error) => `Country code is required`
    }
  ];

  ngOnInit() {
    this.templateId = this.activatedRoute.snapshot.paramMap.get("templateId");
    this.raId = this.activatedRoute.snapshot.paramMap.get("raId");
    for (let i = 0; i < 25; i++) {
      this.numberOfCheckInArray.push({ number: i })
    }
    this.timezoneArray = this.raService.timeZone;

    if (this.raId) {
      this.getCommunicationData(this.raId, this.templateId)
    } else {
      if (this.templateId) {
        this.getRaDetails(this.templateId);
      } else {
        this.router.navigate(['/secure/ra-template/create/template-details']);
      }
    }
    this.raTemplateService.detectTabChanges('raTabChanged', this.raTemplateService.raChangedTab('communication'));
    const minLength = ConstantType.textMinLength;
    const maxLength = ConstantType.textMaxLength;
    const emailPattern = ConstantType.emailPattern;
    const specialCharactorPattern = ConstantType.specialCharactorPattern;

    this.communicationForm = this.formBuilder.group({
      localNumber: this.formBuilder.array([]),
      localEmergencyContact: this.formBuilder.array([]),
      pointOfContact: ['', [
        Validators.pattern(specialCharactorPattern),
        Validators.minLength(minLength),
        Validators.maxLength(maxLength)
      ]],
      checkInTelephone: [, [Validators.pattern(ConstantType.mobileNo)]],
      checkInemail: ['', [Validators.pattern(emailPattern)]],
      overdue: [],
      checkInNumber: ['', [Validators.pattern(specialCharactorPattern)]],
      timeZone: [],
    });
  }


  setSelectedTime = {};
  raCommunicationObjectId: string;

  getCommunicationData(raId, templateId) {
    this.loading = true;
    this.raService.getCommunicationData(raId, templateId).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          if (response.data != null) {
            this.raCommunicationObjectId = response.data._id;
            this.setCommunicationForm(response.data);
          } else {
            this.raCommunicationObjectId = undefined;
            this.getRaCommunicationDataTraveller(this.templateId);
          }
        } 
        // else {
        //   this.responseService.handleErrorResponse(response);
        // }
      }, error => {
        this.loading = false;
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  getRaCommunicationDataTraveller(templateId) {
    const data = {
      types_of_ra_id: this.templateId
    }
    this.raService.getRaCommunicationDataTraveller(data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.setCommunicationForm(response.data);
        } 
        // else {
        //   this.responseService.handleErrorResponse(response);
        // }
      }, error => {
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  getRaDetails(raId) {
    this.loading = true;
    this.raService.getRaDetailsCreatedByClient(raId).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          if (response.communicationData != null) {
            this.communicationId = response.communicationData._id;
            this.setCommunicationForm(response.communicationData);
            // this.raService.getRaCommunicationData(response.communicationData._id).subscribe(
            //   (response: any) => {
            //     if (response.code === 200) {
            //       this.setCommunicationForm(response.data);
            //     } else {
            //       this.loading = false;
            //     }
            //   }
            // )
          } else {
            this.displayDynamicField();
          }
        } 
      }, error=>{
        this.loading = false;
      }
    )
  }

  displayDynamicField(){
    this.addLocalNumber();
    this.addlocalEmergencyContact();
  }

  setCommunicationForm(data) {
    if (data) {
      this.addLocalNumber(data.details_of_team, false);
      this.addlocalEmergencyContact(data.emergency_contact, false);
      this.selected(data.no_of_checkin);
      // this.isShareInfo = data.communication_preview;
      if (data.timezone != null) {
        const getSelectedTimeZone = this.raService.timeZone.filter(element => element.name == data.timezone);
        this.setSelectedTime = { name: getSelectedTimeZone[0].name, value: getSelectedTimeZone[0].value }
      }
      if(data.number != null && data.number != ''){
         this.isCheckInTelephone = true;
      }
      this.communicationForm.patchValue({
        checkInemail: data.email,
        checkInNumber: data.no_of_checkin,
        timeZone: this.setSelectedTime,
        pointOfContact: data.point_of_contact,
        checkInTelephone: data.number,
        overdue: data.detail_an_overdue_procedure
      });

    } else {
      this.displayDynamicField();
    }
  }

  // dynamic local number filed
  addLocalNumber(localNo: any = [], addMoreBtn = true) {
    const control = <FormArray>this.communicationForm.controls.localNumber;
    if (Array.isArray(localNo) && !addMoreBtn) {
      localNo.map(item => {
        this.nestedFormGroupLocalNumber(control, item);
      });
    } else {
      if (control.length < 3) {
        this.nestedFormGroupLocalNumber(control);
      } else {
        this.maxLocalNumberLimitReached = true;
      }

    }
  }
  nestedFormGroupLocalNumber(control, data: any = {}) {
    const localName = data.localName ? data.localName : '';
    const localTelephone = data.localTelephone ? data.localTelephone : '';
    if(localTelephone != null && localTelephone != ''){
      this.isLocalTelephone = true;
    }
    const imei = data.imei ? data.imei : '';
    control.push(
      this.formBuilder.group({
        localName: [localName, [
          Validators.minLength(ConstantType.textMinLength),
          Validators.maxLength(ConstantType.textMaxLength),
          Validators.pattern(ConstantType.specialCharactorPattern)]],
        localTelephone: [localTelephone, [Validators.pattern(ConstantType.mobileNo)]],
        imei: [imei, [Validators.pattern(ConstantType.specialCharactorPattern)]],
      }));
  }

  checkMaxLength(length) {
    if (length < 3) {
      return false;
    } else {
      return true;
    }
  }
  deleteLocalNumberRow(index) {
    const control = <FormArray>this.communicationForm.controls.localNumber;
    control.removeAt(index);
    this.maxLocalNumberLimitReached = this.checkMaxLength(control.length);
  }
  // dynamic local number ends

  // dynamic local emergency contact
  addlocalEmergencyContact(emgConatct: any = [], addMoreBtn = true) {
    const control = <FormArray>this.communicationForm.controls.localEmergencyContact;
    if (Array.isArray(emgConatct) && !addMoreBtn) {
      emgConatct.map(item => {
        this.nestedFormGrouplocalEmergencyContact(control, item);
      });
    } else {
      if (control.length < 3) {
        this.nestedFormGrouplocalEmergencyContact(control);
      } else {
        this.maxLocalEmergencyLimitReached = true;
      }
    }
  }

  nestedFormGrouplocalEmergencyContact(control, data: any = {}) {
    const emgName = data.emgName ? data.emgName : '';
    const emgTelephone = data.emgTelephone ? data.emgTelephone : '';
    if(emgTelephone != null && emgTelephone != ''){
      this.isEmgTelephone = true;
    }
    const emgImei = data.emgImei ? data.emgImei : '';
    const emgEmail = data.emgEmail ? data.emgEmail : '';
    const emgOtherInfo = data.emgOtherInfo ? data.emgOtherInfo : '';
    control.push(
      this.formBuilder.group({
        emgName: [emgName,
          [Validators.minLength(ConstantType.textMinLength),
          Validators.maxLength(ConstantType.textMaxLength),
          Validators.pattern(ConstantType.specialCharactorPattern)
          ]],
        emgTelephone: [emgTelephone, [Validators.pattern(ConstantType.mobileNo)]],
        emgImei: [emgImei, [Validators.pattern(ConstantType.specialCharactorPattern)]],
        emgEmail: [emgEmail, [Validators.pattern(ConstantType.emailPattern)]],
        emgOtherInfo: [emgOtherInfo, [Validators.pattern(ConstantType.specialCharactorPattern)]],
      }));
  }

  deleteLocalEmergencyContactRow(index) {
    const control = <FormArray>this.communicationForm.controls.localEmergencyContact;
    control.removeAt(index);
    this.maxLocalEmergencyLimitReached = this.checkMaxLength(control.length);
  }
  // dynamic local emergency contact ends


  selected(checkInNumber) {
    this.checkInNumber = checkInNumber;
    this.callInTime = [];
    const numberOfCheckIn = 24 / checkInNumber;
    let org_time = '0';
    let dummy_val = 0;
    for (let i = 0; i < checkInNumber; i++) {
      this.callInTime.push({ call_in_time: org_time });
      dummy_val = Math.round(dummy_val + numberOfCheckIn);

      if (dummy_val == 0) {
        org_time = "0000";
      } else if (dummy_val == 1) {
        org_time = "0100";
      } else if (dummy_val == 2) {
        org_time = "0200";
      } else if (dummy_val == 3) {
        org_time = "0300";
      } else if (dummy_val == 4) {
        org_time = "0400";
      } else if (dummy_val == 5) {
        org_time = "0500";
      } else if (dummy_val == 6) {
        org_time = "0600";
      } else if (dummy_val == 7) {
        org_time = "0700";
      } else if (dummy_val == 8) {
        org_time = "0800";
      } else if (dummy_val == 9) {
        org_time = "0900";
      } else if (dummy_val == 10) {
        org_time = "1000";
      } else if (dummy_val == 11) {
        org_time = "1100";
      } else if (dummy_val == 12) {
        org_time = "1200";
      } else if (dummy_val == 13) {
        org_time = "1300";
      } else if (dummy_val == 14) {
        org_time = "1400";
      } else if (dummy_val == 15) {
        org_time = "1500";
      } else if (dummy_val == 16) {
        org_time = "1600";
      } else if (dummy_val == 17) {
        org_time = "1700";
      } else if (dummy_val == 18) {
        org_time = "1800";
      } else if (dummy_val == 19) {
        org_time = "1900";
      } else if (dummy_val == 20) {
        org_time = "2000";
      } else if (dummy_val == 21) {
        org_time = "2100";
      } else if (dummy_val == 22) {
        org_time = "2200";
      } else if (dummy_val == 23) {
        org_time = "2300";
      }
    }
    return this.callInTime;
  }

  timeZoneValue: string;
  submitForm(inputValue) {
    if (this.communicationForm.valid) {
      if (inputValue.timeZone != null) {
        this.timeZoneValue = inputValue.timeZone.name;
      }
      const communicationData = {
        // client_id: this.authService.getUser().client_id,
        types_of_ra_id: this.templateId,
        details_of_team: inputValue.localNumber,
        emergency_contact: inputValue.localEmergencyContact,
        detail_an_overdue_procedure: inputValue.overdue,
        timezone: this.timeZoneValue,
        point_of_contact: inputValue.pointOfContact,
        email: inputValue.checkInemail,
        no_of_checkin: this.checkInNumber,
        number: inputValue.checkInTelephone,
        // communication_preview:this.isShareInfo
      }
      if (this.raId) {
        communicationData['news_ra_id'] = this.raId;
        communicationData['types_of_ra_id'] = this.templateId;
        if (this.raCommunicationObjectId != undefined) {
          communicationData['_id'] = this.raCommunicationObjectId;
          this.updateNewsRaCommunication(communicationData)
        } else {
          const data = [];
          data.push(communicationData);
          //  console.log("data :", communicationData)
          this.addNewsRaCommunication(data);
        }
      } else {
        if (this.communicationId != undefined && this.communicationId != null) {
          communicationData['_id'] = this.communicationId;
          this.updateCommunicationData(communicationData);
        } else {
          this.addCommunicationData(communicationData);
        }
      }
    }
  }
  addNewsRaCommunication(communicationData) {
    this.loading = true;
    this.raService.addNewsRaCommunication(communicationData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          // this.responseService.hanleSuccessResponse(response);
          this.checkRaTemplateStep();
        } 
        // else {
        //   this.responseService.handleErrorResponse(response);
        // }
      }, error => {
        this.loading = false;
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }
  updateNewsRaCommunication(communicationData) {
    this.loading = true;
    this.raService.updateNewsRaCommunication(communicationData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          // this.responseService.hanleSuccessResponse(response);
          this.checkRaTemplateStep();
        } 
        // else {
        //   this.responseService.handleErrorResponse(response);
        // }
      }, error => {
        this.loading = false;
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }
  addCommunicationData(communicationData) {
    this.loading = true;
    this.raService.addRaCommunicationByClientAdmin(communicationData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          // this.responseService.hanleSuccessResponse(response);
          this.checkRaTemplateStep(this.raTemplateService.getRaPages());
        } 
        // else {
        //   this.responseService.handleErrorResponse(response);
        // }
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse(error.error);
        }
      }
    )
  }
  updateCommunicationData(communicationData) {
    this.loading = true;
    this.raService.updateRaCommunicationByClientAdmin(communicationData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          this.checkRaTemplateStep(this.raTemplateService.getRaPages());
          // this.responseService.hanleSuccessResponse(response);
        } 
        // else {
        //   this.responseService.handleErrorResponse(response);
        // }
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse(error.error);
        }
      }
    )
  }
  communication(step, value) {
    if (this.raId) {
      this.riskAssessmentService.communication(step, value)
    } else {
      this.raTemplateService.communication(step, value);
    }
  }

  checkRaTemplateStep(data:any = {}) {
    if (this.raId) {
      this.riskAssessmentService.communication('next');
    } else {
      if (data.contingenciesRequired != true) {
        this.createRaTemplate(this.templateId);
      } else {
        this.raTemplateService.communication('next');
      }
    }
  }

  createRaTemplate(raId) {
    this.raTemplateService.createRaTemplate(raId);
  }


}
