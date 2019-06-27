import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProfileService } from './../../service/profile.service';

import { ResponseService } from '@shared/services/response-handler/response.service';
import { AuthService } from '@app/core/guards/auth.service';
import { MustMatch } from './../../service/must-match.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  formGroup: FormGroup;
  loading: Boolean = false;
  currentUser: any;
  oldPasswordMismatch: Boolean = false;
  constructor (
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private responseService: ResponseService,
    private _service: ProfileService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    const url = '/secure/profile/update';
    const name = 'Change Password';
    const data = [
      { name: name, url: url }
    ];
    this.responseService.createBreadCrum(data);
    this.buildForm();
  }
  // convenience getter for easy access to form fields
  get f() { return this.formGroup.controls; }
  buildForm() {
    this.formGroup = this.formBuilder.group({
      oldPassword: ['', [
          Validators.required,
          Validators.minLength(6)
        ]],
      newpassword: [ '', [
        Validators.required,
        Validators.minLength(6)
      ]],
      cpassword: [ '', [ Validators.required, Validators.minLength(6) ] ],
    }, { validator: MustMatch('newpassword', 'cpassword')
  });
  }

  submit(value) {
    if ( this.formGroup.valid && !this.oldPasswordMismatch ) {
      const dataPost = {
        id: this.currentUser._id,
        password: value.newpassword
      };
      this.loading = true;
      this._service.update(dataPost)
        .subscribe(
          ( data: any) => {
            console.log('data', data);
            this.loading = false;
            if ( data.code === 400 ) {
              // this.responseService.handleErrorResponse(data);
            } else {
              this.formGroup.reset();
              // this.responseService.hanleSuccessResponse(data);
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
  checkOldPassword(value) {
    const dataPost = {
      id: this.currentUser._id,
      password: value
    };
    this._service.checkPassword(dataPost)
      .subscribe(
        ( data: any) => {
          console.log('data', data);
          this.loading = false;
          if ( data.code === 400 ) {
            this.oldPasswordMismatch = true;
            // this.responseService.handleErrorResponse(data);
          } else {
            this.oldPasswordMismatch = false;
            // this.responseService.hanleSuccessResponse(data);
          }
        },
        error => {
          this.loading = false;
          this.oldPasswordMismatch = true;
          // this.responseService.handleErrorResponse(error.error);
        }
      );
  }
}
