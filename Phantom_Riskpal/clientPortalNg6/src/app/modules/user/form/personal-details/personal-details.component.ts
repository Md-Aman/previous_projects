import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserFeatureService } from './../../service/user-feature.service';

import { ResponseService } from '@shared/services/response-handler/response.service';
import { AuthService } from '@app/core/guards/auth.service';
import { ConstantType } from '@app/core/services/constant.type';
import { Router, ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { ErrorMessage } from "ng-bootstrap-form-validation";

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit, OnDestroy {
  userFormGroup: FormGroup;
  passportDataFormGroup: any;
  @Input() id: any; // coming from profile page
  userGroups: any;
  departmentUser: any;
  clients: any;
  commonData: any = {};
  super_admin: Boolean = false;
  maxPassportLimitReached: Boolean = false;
  mobile_number: String = '';
  emg_mobile_number: String = '';
  alt_emg_mobile_number: String = '';
  specialCharactorPattern: any;
  loading: Boolean = false;
  userId: String = '';
  userDetails: any = {};
  currentUser: any;
  fileList: any;
  alive: boolean = false;
  comingFromProfilePage: Boolean = false;
  country = 'gb';
  isUserMobileNo: boolean = false;
  isEmgMobileNo: boolean = false;
  isAltEmgMobileNo: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userFeatureService: UserFeatureService,
    private authService: AuthService,
    private responseService: ResponseService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private el: ElementRef) { }


  customErrorMessages: ErrorMessage[] = [
    {
      error: 'pattern',
      format: (label, error) => `Country code is required`
    }
  ];

  isUserIdExist: boolean = false;
  ngOnInit() {
    console.log("getting id :", this.id);
    this.currentUser = this.authService.getPermission();
    this.super_admin = this.currentUser.super_admin;
    let url = '/secure/user/create';
    let name = 'Create';
    this.userId = this.activeRoute.parent.snapshot.paramMap.get('id'); // get user id from parent component
    console.log("this is the user id :", this.userId);
    if (this.userId) {
      this.isUserIdExist = true;
      url = '/secure/user/update/' + this.userId;
      name = 'Update';
      this.userFeatureService.detectTabChanges('userTab', { tab: 'account', isShowTabs: true, userId: this.userId });
      this.getUserDetails(this.userId);
    } else if (this.id) {
      this.getUserProfile();
      this.comingFromProfilePage = true;
      url = '/secure/profile/update';
      name = 'Profile';
      this.userFeatureService.detectTabChanges('userProfileTab', { tab: 'account'});
    }
    else {
      this.userFeatureService.detectTabChanges('userTab', { tab: 'account', isShowTabs: false, userId: this.userId });
    }



    this.preLoadData();
    this.buildForm();
    // if ( this.userId ) {
    //   this.getUserDetails(this.userId);
    // }
    const data = [
      { name: 'User', url: '/secure/user' },
      { name: name, url: url }
    ];
    this.responseService.createBreadCrum(data);

    // get image through observable
    this.alive = true;
    this.responseService.currentMessage.pipe(takeWhile(() => this.alive)).subscribe(
      (res: any) => {
        if (res.type == 'uploadFile') {
          this.fileList = res.data; // get file
        }
      },
      error => {
        // this.responseService.handleErrorResponse({message: 'There is some error while selecting image. please try again later.'});
      }
    );

  }
  ngOnDestroy() {
    this.alive = false;
  }
  /**
   * get user Data using user id for update
   */
  getUserDetails(userId) {
    this.loading = true;
    this.userFeatureService.getUserDetails(userId)
      .subscribe(
        (data: any) => {
          console.log('userdetails', data);
          this.userDetails = data.data;
          const imageData = {
            type: 'imageData',
            data: {
              url: this.userDetails.image
            }
          };
          this.responseService.changeMessage(imageData); // send user image to parent component
          this.setFormValue(this.userDetails);
          // this.addNewPassportDataRow(this.userDetails, false);
          if (this.super_admin) {
            this.getClientAndDepartmentUser({ _id: this.userDetails.client_id }); // get user based on client
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse({message: 'There is some error while pre populating data. please try again later.'});
        }
      );
  }

  getUserProfile() {
    this.loading = true;
    this.userFeatureService.getUserProfile()
      .subscribe(
        (data: any) => {
          console.log('userdetails', data);
          this.userDetails = data.data;
          const imageData = {
            type: 'imageData',
            data: {
              url: this.userDetails.image
            }
          };
          this.responseService.changeMessage(imageData); // send user image to parent component
          this.setFormValue(this.userDetails);
          // this.addNewPassportDataRow(this.userDetails, false);
          if (this.super_admin) {
            this.getClientAndDepartmentUser({ _id: this.userDetails.client_id }); // get user based on client
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse({message: 'There is some error while pre populating data. please try again later.'});
        }
      );
  }
  setFormValue(user) {
    this.isUserMobileNo = true;
    const emgMobileNo = user.passport_details.mobile_number;
    const altEmgMobileNo = user.passport_details.alternative_mobile_number;
    if (emgMobileNo != null && emgMobileNo != undefined && emgMobileNo != '') {
      this.isEmgMobileNo = true;
    }
    if (altEmgMobileNo != null && altEmgMobileNo != undefined && altEmgMobileNo != '') {
      this.isAltEmgMobileNo = true;
    }
    const emgDetails = this.userDetails.passport_details ? this.userDetails.passport_details : {};
    const userValue = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      dob: new Date(user.dob),
      department: user.department,
      mobile_number: user.mobile_number,
      usergroups: user.roleId,
      gender: user.gender,
      emg_full_name: emgDetails.full_name ? emgDetails.full_name : '',
      emg_email: emgDetails.email ? emgDetails.email : '',
      emg_mobile_number: emgDetails.mobile_number ? emgDetails.mobile_number : '',
      emg_relationship_to_you: emgDetails.relationship_to_you ? emgDetails.relationship_to_you : '',
      alt_emg_full_name: emgDetails.alternative_full_name ? emgDetails.alternative_full_name : '',
      alt_emg_email: emgDetails.alternative_email ? emgDetails.alternative_email : '',
      alt_emg_mobile_number: emgDetails.alternative_mobile_number ? emgDetails.alternative_mobile_number : '',
      alt_emg_relationship_to_you: emgDetails.alternative_relationship_to_you ? emgDetails.alternative_relationship_to_you : '',
      proof_of_life_answer: user.proof_of_life_answer,
      proof_of_life_question: user.proof_of_life_question ? user.proof_of_life_question : '',
      clients: user.client_id,
      // image: '',
      passport_data: []
    };
    this.userFormGroup.patchValue(userValue);
  }
  buildForm() {
    const minLength = ConstantType.textMinLength;
    const maxLength = ConstantType.textMaxLength;
    const emailPattern = ConstantType.emailPattern;
    const specialCharactorPattern = ConstantType.specialCharactorPattern;
    this.specialCharactorPattern = specialCharactorPattern;
    this.userFormGroup = this.formBuilder.group({
      firstname: ['', [
        Validators.required, Validators.pattern(specialCharactorPattern),
        Validators.minLength(minLength), Validators.maxLength(maxLength)
      ]],
      lastname: ['', [
        Validators.required, Validators.pattern(specialCharactorPattern),
        Validators.minLength(minLength), Validators.maxLength(maxLength)
      ]],
      // image: [''],
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      mobile_number: ['', [Validators.required, Validators.pattern(ConstantType.mobileNo)]],
      usergroups: ['', [Validators.required]],
      clients: [''],
      // gender: [''],
      // dob: ['' ],
      department: [[], [Validators.required]],
      // passport_data: this.formBuilder.array([]),
      // emg_full_name: ['', [ Validators.pattern(specialCharactorPattern) ]],
      // emg_mobile_number: ['', Validators.pattern(ConstantType.mobileNo)],
      // emg_email: ['', [ Validators.pattern(emailPattern) ]],
      // emg_relationship_to_you: [''],
      // alt_emg_full_name: ['', [ Validators.pattern(specialCharactorPattern) ]],
      // alt_emg_mobile_number: ['', Validators.pattern(ConstantType.mobileNo)],
      // alt_emg_email: ['', [ Validators.pattern(emailPattern) ]],
      // alt_emg_relationship_to_you: ['', [ Validators.pattern(specialCharactorPattern) ]],
      // proof_of_life_question: [''],
      // proof_of_life_answer: ['', [ Validators.pattern(specialCharactorPattern) ]]

    });
    if (this.id) {
      this.userFormGroup.controls['department'].disable();
      this.userFormGroup.controls['usergroups'].disable();
    }

    // check if user updating his/her profile then don't need email and usergroup
    if (this.super_admin) {
      const clientsControl = this.userFormGroup.get('clients');
      clientsControl.setValidators([Validators.required]);
    }
    // if ( !this.userId ) {
    //   this.addNewPassportDataRow();
    // }
  }
  // addNewPassportDataRow(user: any = [], addMoreBtn = true) {
  //   const control = <FormArray>this.userFormGroup.controls.passport_data;
  //   if ( Array.isArray( user.passport_data ) && !addMoreBtn ) {
  //     user.passport_data.map(item => {
  //       this.nestedFormGroupPassport(control, item);
  //     });
  //   } else {
  //     if ( control.length < 6 ) {
  //       this.nestedFormGroupPassport(control);
  //     } else {
  //       this.maxPassportLimitReached = true;
  //     }
  //   }
  // }
  // nestedFormGroupPassport(control, data: any = {}) {
  //   const nationality = data.nationality ? data.nationality : '';
  //   const passport_number = data.passport_number ? data.passport_number : '';
  //   const issueDate = data.issuedate ? new Date(data.issuedate) : '';
  //   const expirydate = data.expirydate ? new Date(data.expirydate) : '';
  //   control.push(
  //     this.formBuilder.group({
  //       nationality: [nationality],
  //       passport_number: [passport_number, [ Validators.pattern(this.specialCharactorPattern) ]],
  //       issuedate: [issueDate],
  //       expirydate: [expirydate],
  //     }));
  // }
  customSearchFn(term: string, item) {
    return item.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) === 0;
  }
  /**
   * delete passport fields
   */
  // deletePassportDataRow(index) {
  //   const control = <FormArray>this.userFormGroup.controls.passport_data;
  //   control.removeAt(index);
  //   if (control.length < 6) {
  //     this.maxPassportLimitReached = false;
  //   } else {
  //     this.maxPassportLimitReached = true;
  //   }
  // }
  getClientAndDepartmentUser(item) {
    console.log("item :", item);
    this.loading = true;
    this.userFeatureService.getChainDataForUser(false, item._id)
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.userGroups = data[0].data;
          this.departmentUser = data[1].data;
        },
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse({message: 'There is some error while pre populating data. please try again later.'});
        }
      );
  }
  resetInputField(data) {
    this.userFormGroup.patchValue({
      department: null,
      usergroups: null

    })
  }

  preLoadData() {
    const id = this.currentUser.client_id;
    this.loading = true;
    this.userFeatureService.getChainDataForUser(this.super_admin, id)
      .subscribe(
        (data: any) => {
          this.loading = false;
          if (this.super_admin) {
            this.clients = data[0].data;
          } else {
            this.userGroups = data[0].data;
            this.departmentUser = data[1].data;
          }
        },
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse({message: 'There is some error while pre populating data. please try again later.'});
        }
      );

    this.userFeatureService.getCommonChainDataForUser()
      .subscribe(
        (data: any) => {
          const countries = data[0].data;
          const proofOfLife = data[1].data;
          this.commonData = {
            proofOfLife,
            countries
          };
        },
        error => {

        }
      );
  }

  // save data
  submit(value) {
    if (this.userFormGroup.valid) {
      // value.client_id = !this.super_admin ? this.authService.getUser().client_id
      //   : value.clients;
      value.client_id = value.clients;
      // for super admin it will come from dropdown
      // create data according to backend
      // const updateValue = this.configureData(value);
      const updateValue = value;
      if (this.userId) {
        updateValue._id = this.userId;
      } else {
        updateValue._id = this.id;
      }
      this.loading = true;
      const formData: FormData = new FormData();
      console.log('this.fileList', this.fileList);
      if (this.fileList) {
        const file: File = this.fileList;
        formData.append('file', file, file.name);
      }
      formData.append('info', JSON.stringify(updateValue));

      if (this.userId) {
        // update personal details
        this.updateUser(formData);
        console.log('updated');
      } else if (this.id) {
        this.updateProfile(formData);
      } else {
        this.saveUser(formData);
      }
      console.log('value', updateValue);
    } else {
      this.responseService.scrollToError();
    }
    console.log('value', value);
  }

  // configureData ( value ) {
  //   const passportDetails = {
  //     full_name: value.emg_full_name,
  //     email: value.emg_email,
  //     mobile_number: value.emg_mobile_number,
  //     relationship_to_you: value.emg_relationship_to_you,
  //     alternative_full_name: value.alt_emg_full_name,
  //     alternative_email: value.alt_emg_email,
  //     alternative_mobile_number: value.alt_emg_mobile_number,
  //     alternative_relationship_to_you: value.alt_emg_relationship_to_you
  //   };
  //   value.passport_details = passportDetails;
  //   // if ( value.proof_of_life_question ) {
  //   //   value.proof_of_life_question = value.proof_of_life_question ? value.proof_of_life_question._id : this.userDetails;
  //   // }
  //   return value;
  // }
  saveUser(value) {
    this.loading = true;
    this.userFeatureService.saveUser(value)
      .subscribe(
        (data: any) => {
          console.log('data', data);
          this.loading = false;
          if (data.code == 400) {
            this.responseService.handleErrorResponse(data);
          } else {
            // this.responseService.hanleSuccessResponse(data);
            // this.router.navigate(['/secure/user']);
            if (this.userId) {
              this.router.navigate(['/secure/user']);
            } else {
              if (this.userFeatureService.isMedicalEmergcny) {
                this.router.navigate(['/secure/user/update/' + data.user._id + '/emergency-details']);
              } else {
                this.router.navigate(['/secure/user/update/' + data.user._id + '/training-information']);
              }
              this.userFeatureService.detectTabChanges('userTab', { tab: 'account', isShowTabs: true, userId: this.userId });
            }

          }
        },
        error => {
          this.loading = false;
          console.log('error', error);
          this.responseService.handleErrorResponse(error.error);
        }
      );
  }
  updateUser(value) {
    this.loading = true;
    this.userFeatureService.updateUser(value)
      .subscribe(
        (data: any) => {
          console.log('data', data);
          this.loading = false;
          if (data.code == 400) {
            this.responseService.handleErrorResponse(data);
          } else {
            // this.responseService.hanleSuccessResponse(data);
            if (!this.id) {
              if (this.userFeatureService.isMedicalEmergcny) {
                this.router.navigate(['/secure/user/update/' + this.userId + '/emergency-details']);
              } else {
                this.router.navigate(['/secure/user/update/' + this.userId + '/training-information']);
              }
            } else {
              this.router.navigate(['/secure/dashboard']);
            }
          }
        },
        error => {
          this.loading = false;
          console.log('error', error);
          this.responseService.handleErrorResponse(error.error);
        }
      )
  }

  updateProfile(value) {
    this.userFeatureService.updateProfile(value)
      .subscribe(
        (data: any) => {
          console.log('data', data);
          this.loading = false;
          if (data.code == 400) {
            this.responseService.handleErrorResponse(data);
          } else {
            // this.responseService.hanleSuccessResponse(data);
            if (!this.id) {
              this.router.navigate(['/secure/user']);
            } else {
              // this.router.navigate(['/secure/dashboard']);
              this.userFeatureService.detectTabChanges('userProfileTab', { tab: 'emergency'});
            }
          }
        },
        error => {
          this.loading = false;
          console.log('error', error);
          this.responseService.handleErrorResponse(error.error);
        }
      )
  }
}
