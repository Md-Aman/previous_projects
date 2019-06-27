import { Component, OnInit, Input } from '@angular/core';
import { UserFeatureService } from './../../service/user-feature.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ResponseService } from './../../../../shared/services/response-handler/response.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-training-information',
  templateUrl: './training-information.component.html',
  styleUrls: ['./training-information.component.scss']
})
export class TrainingInformationComponent implements OnInit {
  trainingForm: FormGroup;
  @Input() profileId: any;
  loading: boolean = false;
  userId: string = '';

  constructor(
    private userFeatureService: UserFeatureService,
    private formBuilder: FormBuilder,
    private responseService: ResponseService,
    private router: Router,
    private activeRoute: ActivatedRoute, ) { }

  ngOnInit() {
    this.userId = this.activeRoute.parent.snapshot.paramMap.get('id');
    this.buildForm();
    if (this.userId) {
      this.userFeatureService.detectTabChanges('userTab', { tab: 'training', isShowTabs: true });
      this.getUserTrainingInfo(this.userId);
    } else if (this.profileId) {
      this.getProfileTrainingInfo();
    } else {
      this.router.navigate(['/secure/user']);
    }
  }
  buildForm() {
    this.trainingForm = this.formBuilder.group({
      course_provider: [''],
      course_taken: [''],
      course_valid: [''],
      course_qualification: [''],
      refresher_provider: [''],
      refresher_taken: [''],
      refresher_valid: [''],
      refresher_qualification: [''],
      public_provider: [''],
      public_taken: [''],
      public_valid: [''],
      public_qualification: [''],
      aid_provider: [''],
      aid_taken: [''],
      aid_valid: [''],
      aid_qualification: [''],
      risk_provider: [''],
      risk_taken: [''],
      risk_valid: [''],
      risk_qualification: [''],
      manual_provider: [''],
      manual_taken: [''],
      manual_valid: [''],
      manual_qualification: [''],
      assessment_provider: [''],
      assessment_taken: [''],
      assessment_valid: [''],
      assessment_qualification: [''],
      additionalTrainingArray: this.formBuilder.array([]),
    });
  }

  maxInfoReached: boolean;
  addAdditionalTrainingArray(data: any = [], addMoreBtn = true) {
    const control = <FormArray>this.trainingForm.controls.additionalTrainingArray;
    if (Array.isArray(data) && !addMoreBtn) {
      data.map(item => {
        this.nestedAdditionalTrainingArray(control, item);
      });
    } else {
      if (control.length < 3) {
        this.nestedAdditionalTrainingArray(control);
      } else {
        this.maxInfoReached = true;
      }
    }
  }

  nestedAdditionalTrainingArray(control, data: any = {}) {
    const provider = data.provider ? data.provider : '';
    control.push(
      this.formBuilder.group({
        provider: [provider]
      }));
  }

  deleteAdditionalTrainingArray(index) {
    const control = <FormArray>this.trainingForm.controls.additionalTrainingArray;
    control.removeAt(index);
    this.maxInfoReached = this.checkMaxLength(control.length);
  }

  checkMaxLength(length) {
    if (length < 3) {
      return false;
    } else {
      return true;
    }
  }


  submitForm(inputValue) {
    if (this.trainingForm.valid) {
      this.loading = true;
      if (this.profileId) {
        this.profileTraining(inputValue);
      } else {
        const data = inputValue;
        data['userId'] = this.userId;
        this.userTraining(data);
      }
    }
  }

  userTraining(data) {
    this.userFeatureService.updateUserTrainingInfo(data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.router.navigate(['/secure/user']);
          this.responseService.hanleSuccessResponse(response);
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

  profileTraining(data) {
    this.userFeatureService.updateProfileTrainingInfo(data).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.router.navigate(['/secure/dashboard']);
          this.responseService.hanleSuccessResponse(response);
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

  getUserTrainingInfo(userId) {
    this.loading = true;
    this.userFeatureService.getUserTrainingInfo(userId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.setTrainingForm(response.data.training_info);
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

  getProfileTrainingInfo(){
    this.loading = true;
    this.userFeatureService.getProfileTrainingInfo().subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.setTrainingForm(response.data.training_info);
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
      this.userFeatureService.detectTabChanges('userProfileTab', { tab: 'medical' });
    } else {
      if (this.userFeatureService.isMedicalEmergcny) {
        this.router.navigate(['/secure/user/update/' + this.userId + '/medical-information']);
      } else {
        this.router.navigate(['/secure/user/update/' + this.userId + '/personal-details']);
      }
    }
  }

  setTrainingForm(data) {
    if (data != null || data != undefined) {
      this.addAdditionalTrainingArray(data.additionalTrainingArray, false);
      this.trainingForm.patchValue({
        course_provider: data.course_provider,
        course_taken: this.formatDate(data.course_taken),
        course_valid: this.formatDate(data.course_valid),
        course_qualification: data.course_qualification,
        refresher_provider: data.refresher_provider,
        refresher_taken: this.formatDate(data.refresher_taken),
        refresher_valid: this.formatDate(data.refresher_valid),
        refresher_qualification: data.refresher_qualification,
        public_provider: data.public_provider,
        public_taken: this.formatDate(data.public_taken),
        public_valid: this.formatDate(data.public_valid),
        public_qualification: data.public_qualification,
        aid_provider: data.aid_provider,
        aid_taken: this.formatDate(data.aid_taken),
        aid_valid: this.formatDate(data.aid_valid),
        aid_qualification: data.aid_qualification,
        risk_provider: data.risk_provider,
        risk_taken: this.formatDate(data.risk_taken),
        risk_valid: this.formatDate(data.risk_valid),
        risk_qualification: data.risk_qualification,
        manual_provider: data.manual_provider,
        manual_taken: this.formatDate(data.manual_taken),
        manual_valid: this.formatDate(data.manual_valid),
        manual_qualification: data.manual_qualification,
        assessment_provider: data.assessment_provider,
        assessment_taken: this.formatDate(data.assessment_taken),
        assessment_valid: this.formatDate(data.assessment_valid),
        assessment_qualification: data.assessment_qualification
      })
    } else {
      this.addAdditionalTrainingArray();
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
