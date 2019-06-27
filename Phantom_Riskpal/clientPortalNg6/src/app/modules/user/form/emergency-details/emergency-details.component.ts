import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserFeatureService } from './../../service/user-feature.service';
import { ResponseService } from './../../../../shared/services/response-handler/response.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from "./../../../../core/guards/auth.service";
import { ConstantType } from './../../../../core/services/constant.type';

@Component({
  selector: 'app-emergency-details',
  templateUrl: './emergency-details.component.html',
  styleUrls: ['./emergency-details.component.scss']
})
export class EmergencyDetailsComponent implements OnInit {

  emergencyFormGroup: FormGroup;
  @Input() profileId: any;

  constructor(
    private formBuilder: FormBuilder,
    private userFeatureService: UserFeatureService,
    private responseService: ResponseService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private authService: AuthService) { }
  maxPassportLimitReached: boolean;
  maxLanguageLimitReached: boolean;
  isEmgMobileNo: boolean = false;
  isAltEmgMobileNo: boolean = false;
  loading: boolean = false;
  userId: string = '';
  countries: any = [];
  languages: any = [];
  country = 'gb';
  ngOnInit() {
    this.userId = this.activeRoute.parent.snapshot.paramMap.get('id');
    this.buildForm();
    this.getCountries();
    this.getLanguages()
    if (this.userId) {
      this.userFeatureService.detectTabChanges('userTab', { tab: 'emergency', isShowTabs: true });
      this.checkCurrentUserId(this.userId);
      this.getUserMedicalInfo(this.userId);
    } else if (this.profileId) {
      this.getProfileMedicalInfo(this.profileId);
    } else {
      this.router.navigate(['/secure/user']);
    }
  }

  checkCurrentUserId(userId) {
    if (userId) {
      if (this.authService.getPermission()._id != userId) {
        this.medicalInfoAccessStatus(userId);
      }
    }
  }

  medicalInfoAccessStatus(userId) {
    this.userFeatureService.checkEmergencyInfoApproval(userId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          if (response.data.length == 0) {
            this.router.navigate(['/secure/user/update/' + userId + '/personal-details']);
          }
        }
        else {
          this.router.navigate(['/secure/user']);
        }
      }, error => {
        this.router.navigate(['/secure/user']);
      }
    )
  }


  buildForm() {
    const emailPattern = ConstantType.emailPattern;
    this.emergencyFormGroup = this.formBuilder.group({
      Mobile1IMEI: [''],
      PhoneMakeModel: [''],
      MEIDNumber: [''],
      MiscInformation: [''],
      SatellitePhoneNumber: [''],
      SatellitePhoneIMEI: [''],
      TrackerDetails: [''],
      SecondaryEmailAddress: ['', [Validators.pattern(emailPattern)]],
      JobTitle: [''],
      MiddleName: [''],
      OtherNameUsed: [''],
      Gender: [''],
      HomeAddress: [''],
      IdentifyingMarks: [''],
      PressPassID: [''],
      Em1Title: [''],
      Em1Name: [''],
      Em1Relationship: [''],
      Em1TelephoneNumber: [''],
      Em1MobileNumber: ['', [Validators.pattern(ConstantType.mobileNo)]],
      Em1EmailAddress: ['', [Validators.pattern(emailPattern)]],
      Em1HomeAddress: [''],
      Em1MiscInformation: [''],
      Em2Title: [''],
      Em2Name: [''],
      Em2Relationship: [''],
      Em2TelephoneNumber: [''],
      Em2MobileNumber: ['', [Validators.pattern(ConstantType.mobileNo)]],
      Em2EmailAddress: ['', [Validators.pattern(emailPattern)]],
      Em2HomeAddress: [''],
      Em2MiscInformation: [''],
      CrisisStatement1: [''],
      CrisisStatement2: [''],
      CrisisStatement3: [''],
      DuressWord: [''],
      DuressAction: [''],
      passport_data: this.formBuilder.array([]),
      languages: this.formBuilder.array([]),
    });
  }

  addNewLanguage(data: any = [], addMoreBtn = true) {
    const control = <FormArray>this.emergencyFormGroup.controls.languages;
    if (Array.isArray(data) && !addMoreBtn) {
      data.map(item => {
        this.nestedFormGroupLanguage(control, item);
      });
    } else {
      if (control.length < 3) {
        this.nestedFormGroupLanguage(control);
      } else {
        this.maxLanguageLimitReached = true;
      }
    }
  }

  nestedFormGroupLanguage(control, data: any = {}) {
    const languagesSpoken = data.LanguagesSpoken ? data.LanguagesSpoken : '';
    control.push(
      this.formBuilder.group({
        LanguagesSpoken: [languagesSpoken]
      }));
  }
  addNewPassportDataRow(data: any = [], addMoreBtn = true) {
    const control = <FormArray>this.emergencyFormGroup.controls.passport_data;
    if (Array.isArray(data) && !addMoreBtn) {
      data.map(item => {
        this.nestedFormGroupPassport(control, item);
      });
    } else {
      if (control.length < 6) {
        this.nestedFormGroupPassport(control);
      } else {
        this.maxPassportLimitReached = true;
      }
    }
  }
  nestedFormGroupPassport(control, data: any = {}) {
    const dateOfBirth = this.formatDate(data.dateOfBirth);
    const nationality = data.nationality ? data.nationality : '';
    const issuedate = this.formatDate(data.issuedate);
    const passport_number = data.passport_number ? data.passport_number : '';
    const expirydate = this.formatDate(data.expirydate);
    control.push(
      this.formBuilder.group({
        dateOfBirth: [dateOfBirth],
        nationality: [nationality],
        passport_number: [passport_number],
        issuedate: [issuedate],
        expirydate: [expirydate],
      }));
  }
  customSearchFn(term: string, item) {
    return item.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) === 0;
  }
  /**
   * delete passport fields
   */

  deletePassportDataRow(index) {
    const control = <FormArray>this.emergencyFormGroup.controls.passport_data;
    control.removeAt(index);
    if (control.length < 6) {
      this.maxPassportLimitReached = false;
    } else {
      this.maxPassportLimitReached = true;
    }
  }

  deleteLanguage(index) {
    const control = <FormArray>this.emergencyFormGroup.controls.languages;
    control.removeAt(index);
    if (control.length < 3) {
      this.maxLanguageLimitReached = false;
    } else {
      this.maxLanguageLimitReached = true;
    }
  }

  submitForm(inputValue) {
    if (this.emergencyFormGroup.valid) {
      this.loading = true;
      if (this.profileId) {
        this.profileEmergency(inputValue);
      } else {
        const data = inputValue;
        data['userId'] = this.userId;
        this.userEmergency(data);
      }
    }
  }

  userEmergency(data) {
    this.userFeatureService.updateUserEmergencyDetails(data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.responseService.hanleSuccessResponse(response);
          this.router.navigate(['/secure/user/update/' + this.userId + '/medical-information']);
          this.loading = false;
        }
        else {
          this.loading = false;
          this.responseService.handleErrorResponse(response);
        }
      }, error => {
        this.loading = false;
        this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  profileEmergency(data) {
    this.userFeatureService.updateProfileEmergencyDetails(data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.responseService.hanleSuccessResponse(response);
          this.userFeatureService.detectTabChanges('userProfileTab', { tab: 'medical' });
          this.loading = false;
        }
        else {
          this.loading = false;
          this.responseService.handleErrorResponse(response);
        }
      }, error => {
        this.loading = false;
        this.responseService.handleErrorResponse(error.error);
      }
    )
  }
  getUserMedicalInfo(userId) {
    this.loading = true;
    this.userFeatureService.getUserEmergencyDetails(userId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.setEmergencyForm(response.data);
        }
        else {
          this.loading = false;
          this.responseService.handleErrorResponse(response);
        }
      }, error => {
        this.loading = false;
        this.responseService.handleErrorResponse(error.error);
      }
    )
  }
  getProfileMedicalInfo(userId) {
    this.loading = true;
    this.userFeatureService.getUserProfileEmergencyDetails().subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.setEmergencyForm(response.data);
        }
        else {
          this.loading = false;
          this.responseService.handleErrorResponse(response);
        }
      }, error => {
        this.loading = false;
        this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  getCountries() {
    this.loading = true;
    this.userFeatureService.getCountries().subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.countries = response.data;
        } else {
          this.loading = false;
          this.responseService.handleErrorResponse(response);
        }
      }, error => {
        this.loading = false;
        this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  getLanguages() {
    this.loading = true;
    this.userFeatureService.getLanguages().subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.languages = response.data;
        } else {
          this.loading = false;
          this.responseService.handleErrorResponse(response);
        }
      }, error => {
        this.loading = false;
        this.responseService.handleErrorResponse(error.error);
      }
    )
  }

  navigatePrevTab() {
    if (this.profileId) {
      this.userFeatureService.detectTabChanges('userProfileTab', { tab: 'account' });
    } else {
      this.router.navigate(['/secure/user/update/' + this.userId + '/personal-details']);
    }
  }

  setEmergencyForm(data) {
    if (data != null || data != undefined) {
      const emergencyData = data.passport_details;
      this.addNewLanguage(data.languages, false);
      this.addNewPassportDataRow(data.passport_data, false);
      const emg_num = emergencyData.mobile_number;
      const emg_alt_Num = emergencyData.alternative_mobile_number;
      if (emg_num != null && emg_num != undefined && emg_num != '') {
        this.isEmgMobileNo = true;
      }
      if (emg_alt_Num != null && emg_alt_Num != undefined && emg_alt_Num != '') {
        this.isAltEmgMobileNo = true;
      }
      if (data.languages.length == 0) {
        this.addNewLanguage();
      }
      this.emergencyFormGroup.patchValue({
        Mobile1IMEI: data.communications.mobile1_imei,
        PhoneMakeModel: data.communications.phone_make_model,
        MEIDNumber: data.communications.meid_number,
        MiscInformation: data.communications.misc_info,
        SatellitePhoneNumber: data.communications.satellite_phone_number,
        SatellitePhoneIMEI: data.communications.satellite_phone_imei,
        TrackerDetails: data.communications.tracker_details,
        SecondaryEmailAddress: data.communications.secondary_email_address,
        JobTitle: data.job_title,
        MiddleName: data.middle_name,
        OtherNameUsed: data.other_name_used,
        Gender: data.gender,
        HomeAddress: data.home_address,
        IdentifyingMarks: data.identifying_marks,
        PressPassID: data.press_pass_id,
        Em1Title: emergencyData.title,
        Em1Name: emergencyData.full_name,
        Em1Relationship: emergencyData.relationship_to_you,
        Em1TelephoneNumber: emergencyData.telephone_number,
        Em1MobileNumber: emergencyData.mobile_number,
        Em1EmailAddress: emergencyData.email,
        Em1HomeAddress: emergencyData.home_address,
        Em1MiscInformation: emergencyData.miscInfo_instruction,
        Em2Title: emergencyData.alternative_title,
        Em2Name: emergencyData.alternative_full_name,
        Em2Relationship: emergencyData.alternative_relationship_to_you,
        Em2TelephoneNumber: emergencyData.alternative_telephone_number,
        Em2MobileNumber: emergencyData.alternative_mobile_number,
        Em2EmailAddress: emergencyData.alternative_email,
        Em2HomeAddress: emergencyData.alternative_home_address,
        Em2MiscInformation: emergencyData.alternative_miscInfo_instruction,
        CrisisStatement1: data.crisis_info.crisis_statement1,
        CrisisStatement2: data.crisis_info.crisis_statement2,
        CrisisStatement3: data.crisis_info.crisis_statement3,
        DuressWord: data.crisis_info.duress_word,
        DuressAction: data.crisis_info.duress_action,
      });
    } else {
      this.renderDynamicField();
    }
    this.loading = false;
  }


  renderDynamicField() {
    this.addNewLanguage();
    this.addNewPassportDataRow();
  }

  formatDate(date) {
    if (date == '' || date == null) {
      return null;
    } else {
      return new Date(date);
    }
  }



}
