import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserFeatureService } from './../../service/user-feature.service';

import { ResponseService } from '@shared/services/response-handler/response.service';
import { AuthService } from '@app/core/guards/auth.service';
import { ConstantType } from '@app/core/services/constant.type';
import { Router, ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { ErrorMessage } from "ng-bootstrap-form-validation";

@Component({
  selector: 'app-create-rpstaff',
  templateUrl: './create-rpstaff.component.html',
  styleUrls: ['./create-rpstaff.component.scss']
})
export class CreateRpstaffComponent implements OnInit {
  userFormGroup: FormGroup;
  loading: Boolean = false;
  @Input() id: String = '';
  alive: boolean = false;
  passwordField: Boolean = true; // show password field to RPSTAFF user while creating
  fileList: any;
  updateProfile: Boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private userFeatureService: UserFeatureService,
    private authService: AuthService,
    private responseService: ResponseService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) { }


  customErrorMessages: ErrorMessage[] = [
    {
      error: 'pattern',
      format: (label, error) => `Country code is required`
    }
  ];


  ngOnInit() {
    let url = '/secure/user/rpstaff/create';
    let name = 'Create';
    let data = [
      { name: 'User', url: '/secure/user' },
      { name: name, url: url }
    ];
    if ( this.id ) {
      name = 'Update';
      url = '/secure/profile/update';
      data = [
        { name: name, url: url }
      ];
      this.preLoadData(this.id);
      this.updateProfile = true;
    }

    this.responseService.createBreadCrum(data);
    this.buildForm();

    // get image through observable
    this.alive = true;
    this.responseService.currentMessage.pipe(takeWhile(() => this.alive)).subscribe(
      ( res: any ) => {
        if ( res.type == 'uploadFile' ) {
          this.fileList = res.data; // get file
        }
      },
      error => {
        // this.responseService.handleErrorResponse({message: 'There is some error while selecting image. please try again later.'});
      }
    );

  }
  preLoadData(id) {
    const obj = {
      id : id
    };
    this.userFeatureService.getUserDetailsMaster(obj)
      .subscribe(
        ( data: any) => {
          console.log('data', data);
          this.loading = false;
          this.setForm(data.data);
          const userDetails = data.data;
          const imageData = {
            type: 'imageData',
            data: {
              url: userDetails.image
            }
          };
          this.responseService.changeMessage(imageData); // send user image to parent component
        },
        error => {
          this.loading = false;
          console.log('error', error);
          // this.responseService.handleErrorResponse(error.error);
        }
      );
  }
  setForm(data) {
    this.userFormGroup.patchValue({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      mobile_number: data.mobile_number
    });
    this.userFormGroup.get('email').disable();
    this.userFormGroup.get('mobile_number').disable();
    this.userFormGroup.get('password').setValidators(null);
    this.passwordField = false;
  }
  buildForm() {
    const minLength = ConstantType.textMinLength;
    const maxLength = ConstantType.textMaxLength;
    const emailPattern = ConstantType.emailPattern;
    const specialCharactorPattern = ConstantType.specialCharactorPattern;
    this.userFormGroup = this.formBuilder.group({
      firstname: ['', [
          Validators.required, Validators.pattern(specialCharactorPattern),
          Validators.minLength(minLength), Validators.maxLength(maxLength)
        ]],
      lastname: [ '', [
        Validators.required, Validators.pattern(specialCharactorPattern),
        Validators.minLength(minLength), Validators.maxLength(maxLength)
      ]],
      email: [ '', [ Validators.required, Validators.pattern(emailPattern) ] ],
      mobile_number: [ '', [ Validators.required, Validators.pattern(ConstantType.mobileNo) ] ],
      password: ['', [ Validators.required,  Validators.minLength(6) ] ],
    });
  }

  // save data
  submit (value) {
    if ( this.userFormGroup.valid ) {
      this.loading = true;
      if ( this.id ) {
        value._id = this.id;
        const formData: FormData = new FormData();
        console.log('this.fileList', this.fileList);
        if ( this.fileList ) {
          const file: File = this.fileList;
          formData.append('file', file, file.name);
        }
        formData.append('info', JSON.stringify(value));
        this.updateUser(formData);
      } else {
        this.saveUser(value);
      }

    }
  }
  saveUser(value) {
    this.userFeatureService.saveRPstaff(value)
      .subscribe(
        ( data: any) => {
          console.log('data', data);
          this.loading = false;
          if ( data.code == 400 ) {
            this.responseService.handleErrorResponse(data);
          } else {
            if ( this.updateProfile ) {
              this.router.navigate(['/secure/dashboard']);
            } else {
              this.router.navigate(['/secure/user/rpstaff']);
            }
            this.responseService.hanleSuccessResponse(data);
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
    this.userFeatureService.updateRPstaff(value)
      .subscribe(
        ( data: any) => {
          console.log('data', data);
          this.loading = false;
          if ( data.code == 400 ) {
            this.responseService.handleErrorResponse(data);
          } else {
            this.responseService.hanleSuccessResponse(data);
            if ( this.updateProfile ) {
              this.router.navigate(['/secure/dashboard']);
            } else {
              this.router.navigate(['/secure/user/rpstaff']);
            }
          }
        },
        error => {
          this.loading = false;
          console.log('error', error);
          // this.responseService.handleErrorResponse(error.error);
        }
      );
  }

}
