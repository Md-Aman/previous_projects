import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RaTemplateService } from './../../../modules/ra-template/service/ra-template.service';
import { ConstantType } from './../../../core/services/constant.type';
import { RaService } from './../service/ra.service';
import { AuthService } from './../../../core/guards/auth.service';
import { ResponseService } from './../../../shared/services/response-handler/response.service';
import { RiskAssessmentService } from './../../../modules/ra/service/risk-assessment.service';


@Component({
  selector: 'app-contingency',
  templateUrl: './contingency.component.html',
  styleUrls: ['./contingency.component.scss']
})
export class ContingencyComponent implements OnInit {
  contingencyForm: FormGroup;
  public loading = false;

  constructor(
    public raTemplateService: RaTemplateService,
    private raService: RaService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private responseService: ResponseService,
    private riskAssessmentService: RiskAssessmentService,
    private authService: AuthService,
    private formBuilder: FormBuilder) { }

  minLength: number;
  maxLength: number;
  specialCharactorPattern: RegExp;

  satPhoneNumber: boolean = false;
  trackerId: boolean = false;
  firstAidKit: boolean = false;
  personalProtectiveEquipment: boolean = false;
  contingencyId: string;
  templateId: string;
  raId: string;
  noOfSatellitePhone:string;
  noOfTracker:string;
  firstAidKitDetails:string;
  personalProtectiveEquipmentDetails:string;

  ngOnInit() {
    this.templateId = this.activatedRoute.snapshot.paramMap.get("templateId");
    this.raId = this.activatedRoute.snapshot.paramMap.get("raId");


    if (this.raId) {
      this.getContingencyData(this.raId, this.templateId)
    } else {
      if (this.templateId) {
        this.getRaDetails(this.templateId);
      } else {
        this.router.navigate(['/secure/ra-template/create/template-details']);
      }
    }

    this.raTemplateService.detectTabChanges('raTabChanged', this.raTemplateService.raChangedTab('contingency'));

    this.minLength = ConstantType.textMinLength;
    this.maxLength = ConstantType.textMaxLength;
    this.specialCharactorPattern = ConstantType.specialCharactorPattern;

    this.contingencyForm = this.formBuilder.group({
      medicalSkill: ['', [
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength)
      ]],
      hospitalInformation: this.formBuilder.array([]),
      methodOfEvacuation: ['', [
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength)
      ]],
      medicalEvacuationCompany: this.formBuilder.array([]),
      embassyLocation: this.formBuilder.array([]),
      additionalItem: []

    });
  }

  maxHospitalInfoReached: boolean = false;
  maxEvacuationCompany: boolean = false;
  maxEmbassyLocation: boolean = false;

  checkMaxLength(length) {
    if (length < 3) {
      return false;
    } else {
      return true;
    }
  }
  raContingencyObjectId: string;
  getContingencyData(raId, templateId) {
    this.loading = true;
    this.raService.getContingencyDataTraveller(raId, templateId).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          if (response.data != null) {
            this.raContingencyObjectId = response.data._id;
            this.setContingencyForm(response.data);
          } else {
            this.raContingencyObjectId = undefined;
            this.getRaContingencyData(this.templateId);
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

  getRaContingencyData(templateId) {
    const data = {
      types_of_ra_id: this.templateId
    }
    this.raService.getRaContingencyData(data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.setContingencyForm(response.data);
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
          if (response.contingencyData != null) {
            this.contingencyId = response.contingencyData._id;
            this.setContingencyForm(response.contingencyData);
            // this.raService.getContingencyData(response.contingencyData._id).subscribe(
            //   (response: any) => {
            //     if (response.code === 200) {
            //       this.setContingencyForm(response.data);
            //       this.loading = false;
            //     } else {
            //       this.loading = false;
            //     }
            //   }
            // )
          } else {
            this.displayDynamicField();
          }
        }
      }, error => {
        this.loading = false;
      }
    )
  }

  displayDynamicField() {
    this.addHospitalInformation();
    this.addMedicalEvacuationCompany();
    this.addEmbassyLocation();
  }

  setContingencyForm(data) {
    if (data) {
      this.addHospitalInformation(data.detail_nearest_hospital, false);
      this.addMedicalEvacuationCompany(data.medevac_company, false);
      this.addEmbassyLocation(data.embassy_location, false);
      this.contingencyForm.patchValue({
        medicalSkill: data.medical_provision,
        methodOfEvacuation: data.method_of_evacuation,
        additionalItem: data.additional_item
      })
      this.satPhoneNumber = data.sat_phone_number;
      this.trackerId = data.tracker_id;
      this.firstAidKit = data.first_aid_kit;
      this.personalProtectiveEquipment = data.personal_protective_equipment;
      this.noOfSatellitePhone = data.no_of_satellite_phone;
      this.noOfTracker = data.no_of_tracker;
      this.firstAidKitDetails = data.first_aid_kit_details;
      this.personalProtectiveEquipmentDetails = data.personal_protective_equipment_details;
    } else {
      this.displayDynamicField();
    }
  }

  // Local Hospital Info
  addHospitalInformation(localHospital: any = [], addMoreBtn = true) {
    const control = <FormArray>this.contingencyForm.controls.hospitalInformation;
    if (Array.isArray(localHospital) && !addMoreBtn) {
      localHospital.map(item => {
        this.nestedHospitalInformation(control, item);
      });
    } else {
      if (control.length < 3) {
        this.nestedHospitalInformation(control);
      } else {
        this.maxHospitalInfoReached = true;
      }
    }
  }

  nestedHospitalInformation(control, data: any = {}) {
    const hospitalInfo = data.localHospitalInfo ? data.localHospitalInfo : '';
    control.push(
      this.formBuilder.group({
        localHospitalInfo: [hospitalInfo, [
          Validators.minLength(this.minLength),
          Validators.maxLength(this.maxLength),
        ]]
      }));
  }

  deleteHospitalInformation(index) {
    const control = <FormArray>this.contingencyForm.controls.hospitalInformation;
    control.removeAt(index);
    this.maxHospitalInfoReached = this.checkMaxLength(control.length);
  }


  // medical evacuation company
  addMedicalEvacuationCompany(evacuationCompany: any = [], addMoreBtn = true) {
    const control = <FormArray>this.contingencyForm.controls.medicalEvacuationCompany;
    if (Array.isArray(evacuationCompany) && !addMoreBtn) {
      evacuationCompany.map(item => {
        this.nestedMedicalCompany(control, item);
      });
    } else {
      if (control.length < 3) {
        this.nestedMedicalCompany(control);
      } else {
        this.maxEvacuationCompany = true;
      }
    }
  }

  nestedMedicalCompany(control, data: any = {}) {
    const medicalCompany = data.medicalCompany ? data.medicalCompany : '';
    control.push(
      this.formBuilder.group({
        medicalCompany: [medicalCompany, [
          Validators.minLength(this.minLength),
          Validators.maxLength(this.maxLength),
        ]]
      }));
  }
  deleteMedicalEvacuationCompany(index) {
    const control = <FormArray>this.contingencyForm.controls.medicalEvacuationCompany;
    control.removeAt(index);
    this.maxEvacuationCompany = this.checkMaxLength(control.length);
  }


  // Embassy Location
  addEmbassyLocation(embassyLocation: any = [], addMoreBtn = true) {
    const control = <FormArray>this.contingencyForm.controls.embassyLocation;
    if (Array.isArray(embassyLocation) && !addMoreBtn) {
      embassyLocation.map(item => {
        this.nestedEmbassyLocation(control, item);
      });
    } else {
      if (control.length < 3) {
        this.nestedEmbassyLocation(control);
      } else {
        this.maxEmbassyLocation = true;
      }
    }
  }

  nestedEmbassyLocation(control, data: any = {}) {
    const embassyLoc = data.embassyLoc ? data.embassyLoc : '';
    control.push(
      this.formBuilder.group({
        embassyLoc: [embassyLoc, [
          Validators.minLength(this.minLength),
          Validators.maxLength(this.maxLength),
        ]]
      }));
  }
  deleteEmbassyLocation(index) {
    const control = <FormArray>this.contingencyForm.controls.embassyLocation;
    control.removeAt(index);
    this.maxEmbassyLocation = this.checkMaxLength(control.length);
  }


  addCheckboxValuetoObject(obj, Value, filedName) {
    if (Value == true) {
      obj[filedName] = true;
    }
  }

  submitForm(inputValue) {
    if (this.contingencyForm.valid) {
      const contingencyData = {
        // client_id: this.authService.getUser().client_id,
        types_of_ra_id: this.templateId,
        super_admin: 0,
        medical_provision: inputValue.medicalSkill,
        detail_nearest_hospital: inputValue.hospitalInformation,
        method_of_evacuation: inputValue.methodOfEvacuation,
        medevac_company: inputValue.medicalEvacuationCompany,
        embassy_location: inputValue.embassyLocation,
        additional_item: inputValue.additionalItem,
        no_of_satellite_phone: this.noOfSatellitePhone,
        no_of_tracker: this.noOfTracker,
        first_aid_kit_details: this.firstAidKitDetails,
        personal_protective_equipment_details: this.personalProtectiveEquipmentDetails
      }
      this.addCheckboxValuetoObject(contingencyData, this.satPhoneNumber, 'sat_phone_number');
      this.addCheckboxValuetoObject(contingencyData, this.trackerId, 'tracker_id');
      this.addCheckboxValuetoObject(contingencyData, this.firstAidKit, 'first_aid_kit');
      this.addCheckboxValuetoObject(contingencyData, this.personalProtectiveEquipment, 'personal_protective_equipment');

      if (this.raId) {
        contingencyData['news_ra_id'] = this.raId;
        // contingencyData['types_of_ra_id'] = this.templateId;
        if (this.raContingencyObjectId != undefined) {
          contingencyData['_id'] = this.raContingencyObjectId;
          this.updateNewsRaContingencies(contingencyData)
        } else {
          const data = [];
          data.push(contingencyData);
          this.addNewsRaContingencies(data);
        }
      } else {
        if (this.contingencyId != undefined && this.contingencyId != null) {
          contingencyData['_id'] = this.contingencyId;
          this.updateContingencyData(contingencyData);
        } else {
          this.addContingencyData(contingencyData);
        }
      }
    }

  }

  addNewsRaContingencies(contingencyData) {
    this.loading = true;
    this.raService.addNewsRaContingencies(contingencyData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          // this.responseService.hanleSuccessResponse(response);
          this.createRaTemplate();
        }
        //  else {
        //   this.responseService.handleErrorResponse(response);
        // }
      }, error => {
        this.loading = false;
        // this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  updateNewsRaContingencies(communicationData) {
    this.loading = true;
    this.raService.updateNewsRaContingencies(communicationData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          // this.responseService.hanleSuccessResponse(response);
          this.createRaTemplate();
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
  addContingencyData(contingencyData) {
    this.loading = true;
    this.raService.addRaContingencyByClientAdmin(contingencyData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          this.createRaTemplate(this.templateId);
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

  updateContingencyData(contingencyData) {
    this.loading = true;
    this.raService.updateRaContingencyByClientAdmin(contingencyData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          this.createRaTemplate(this.templateId);
          // this.responseService.hanleSuccessResponse(response);
        }
        //  else {
        //   this.responseService.handleErrorResponse(response);
        // }
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse(error.error);
        }
      }
    )
  }

  contingency(step) {
    if (this.raId) {
      this.riskAssessmentService.contingency(step, false);
    } else {
      this.raTemplateService.contingency(step);
    }
  }

  createRaTemplate(raId = '') {
    if (this.raId) {
      this.riskAssessmentService.contingency('next');
    } else {
      this.raTemplateService.createRaTemplate(raId);
    }
  }
}
