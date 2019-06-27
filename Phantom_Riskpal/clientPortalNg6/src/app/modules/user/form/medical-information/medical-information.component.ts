import { Component, OnInit, Input } from '@angular/core';
import { UserFeatureService } from './../../service/user-feature.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ResponseService } from './../../../../shared/services/response-handler/response.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from "./../../../../core/guards/auth.service";

@Component({
  selector: 'app-medical-information',
  templateUrl: './medical-information.component.html',
  styleUrls: ['./medical-information.component.scss']
})
export class MedicalInformationComponent implements OnInit {

  medicalFormGroup: FormGroup;
  @Input() profileId: any;
  loading: boolean = false;
  userId: string = '';
  constructor(
    private userFeatureService: UserFeatureService,
    private formBuilder: FormBuilder,
    private responseService: ResponseService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit() {
    this.userId = this.activeRoute.parent.snapshot.paramMap.get('id');

    this.buildForm();
    if (this.userId) {
      this.userFeatureService.detectTabChanges('userTab', { tab: 'medical', isShowTabs: true });
      this.checkCurrentUserId(this.userId);
      this.getUserMedicalInfo(this.userId);
    } else if (this.profileId) {
      this.getProfileMedicalInfo();
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
    this.medicalFormGroup = this.formBuilder.group({
      BloodGroup: [''],
      MedicalCondition: [''],
      PrescribedMedication: [''],
      DiptheriaTetanusPolio: [],
      DiptheriaTetanusPolioDate: [''],
      HepatitisA: [],
      HepatitisADate: [''],
      HepatitisB: [],
      HepatitisBDate: [''],
      JapaneseEncephalitis: [],
      JapaneseEncephalitisDate: [''],
      MeasleMumps: [],
      MeasleMumpsDate: [''],
      MeningococcalInfection: [],
      MeningococcalInfectionDate: [''],
      Polio: [],
      PolioDate: [''],
      Rabies: [],
      RabiesDate: [''],
      Tetanus: [],
      TetanusDate: [''],
      TyphoidFever: [],
      TyphoidFeverDate: [''],
      YellowFever: [],
      YellowFeverDate: ['']
    });
  }

  submitForm(inputValue) {
    if (this.medicalFormGroup.valid) {
      this.loading = true;
      if (this.profileId) {
        this.profileMedical(inputValue);
      } else {
        const data = inputValue;
        data['userId'] = this.userId;
        this.userMedical(data);
      }
    }
  }

  userMedical(data) {
    this.userFeatureService.updateUserMedicalInfo(data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.responseService.hanleSuccessResponse(response);
          this.router.navigate(['/secure/user/update/' + this.userId + '/training-information']);
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

  profileMedical(data) {
    this.userFeatureService.updateProfileMedicalInfo(data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.responseService.hanleSuccessResponse(response);
          this.userFeatureService.detectTabChanges('userProfileTab', { tab: 'training' });
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
    this.userFeatureService.getUserMedicalInfo(userId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.setMedicalForm(response.data.medical_info);
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

  getProfileMedicalInfo(){
    this.loading = true;
    this.userFeatureService.getProfileMedicalInfo().subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.setMedicalForm(response.data.medical_info);
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

  navigatePrevTab() {
    if (this.profileId) {
      this.userFeatureService.detectTabChanges('userProfileTab', { tab: 'emergency' });
    } else {
      this.router.navigate(['/secure/user/update/' + this.userId + '/emergency-details']);
    }
  }

  setMedicalForm(data) {
    if (data != null || data != undefined) {
      this.medicalFormGroup.patchValue({
        BloodGroup: data.BloodGroup,
        MedicalCondition: data.MedicalCondition,
        PrescribedMedication: data.PrescribedMedication,
        DiptheriaTetanusPolio: data.DiptheriaTetanusPolio,
        DiptheriaTetanusPolioDate: this.formatDate(data.DiptheriaTetanusPolioDate),
        HepatitisA: data.HepatitisA,
        HepatitisADate: this.formatDate(data.HepatitisADate),
        HepatitisB: data.HepatitisB,
        HepatitisBDate: this.formatDate(data.HepatitisBDate),
        JapaneseEncephalitis: data.JapaneseEncephalitis,
        JapaneseEncephalitisDate: this.formatDate(data.JapaneseEncephalitisDate),
        MeasleMumps: data.MeasleMumps,
        MeasleMumpsDate: this.formatDate(data.MeasleMumpsDate),
        MeningococcalInfection: data.MeningococcalInfection,
        MeningococcalInfectionDate: this.formatDate(data.MeningococcalInfectionDate),
        Polio: data.Polio,
        PolioDate: this.formatDate(data.PolioDate),
        Rabies: data.Rabies,
        RabiesDate: this.formatDate(data.RabiesDate),
        Tetanus: data.Tetanus,
        TetanusDate: this.formatDate(data.TetanusDate),
        TyphoidFever: data.TyphoidFever,
        TyphoidFeverDate: this.formatDate(data.TyphoidFeverDate),
        YellowFever: data.YellowFever,
        YellowFeverDate: this.formatDate(data.YellowFeverDate)
      });
    }
    this.loading = false;
  }

  formatDate(date) {
    if (date == '' || date == null) {
      return null;
    } else {
      return new Date(date);
    }
  }


}
