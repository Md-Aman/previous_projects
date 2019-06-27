import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { IndexService } from '../service/index.service';

import { ResponseService } from '@shared/services/response-handler/response.service';
import { AuthService } from '@app/core/guards/auth.service';
import { ConstantType } from '@app/core/services/constant.type';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';
import { RaService } from './../../../../shared/ra/service/ra.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],

})
export class CreateComponent implements OnInit {

  formGroup: FormGroup;
  loading: Boolean = false;
  Id: any = '';
  specialCharactorPattern: any = '';
  currentUser: any;
  email: any = {};
  constructor(
    private formBuilder: FormBuilder,
    private _service: IndexService,
    private authService: AuthService,
    private responseService: ResponseService,
    private router: Router,
    private raService: RaService,
    private activeRoute: ActivatedRoute,
    private dialogRef: MatDialogRef<CreateComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) { }

  ngOnInit() {
    // this.Id = this.activeRoute.snapshot.paramMap.get('id'); // get user id from parent component
    this.Id = this.data.id;
    this.currentUser = this.authService.getUser();
    this.buildForm();
    let breadCrumName = 'Create';
    let url = '/secure/manage-riskpal/question/create';
    if ( this.Id ) {
      breadCrumName = 'Update';
      url = '/secure/manage-riskpal/email-template/update/' + this.Id;
      this.getDetails(this.Id);
    }
    const data = [
      { name: 'Email Template', url: '/secure/manage-riskpal/email-template' },
      { name: breadCrumName, url: url }
    ];
    this.responseService.createBreadCrum(data);
  }

  getDetails(id) {
    this.loading = true;
    this._service.getSingle(id)
      .subscribe(
        ( data: any ) => {
          console.log('userdetails', data);
          this.email = data.data;
          this.setFormValue(data.data);
          this.loading = false;
        },
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse({message: 'There is some error while pre populating data. please try again later.'});
        }
      );
  }

  // build reactive form
  buildForm() {

    const minLength = ConstantType.textMinLength;
    const maxLength = ConstantType.textMaxLength;
    const specialCharactorPattern = ConstantType.specialCharactorPattern;
    this.specialCharactorPattern = specialCharactorPattern;
    this.formGroup = this.formBuilder.group({
      unique_keyword: ['', [ Validators.required ]],
      title: ['', [
          Validators.required,
          Validators.minLength(minLength)
        ]],
      description: ['', [
        Validators.required
      ]],
      subject: ['', [ Validators.required ]]
    });
  }

   // save data
   submit (value) {
    if ( this.formGroup.valid ) {
      // create data according to backend
      const updateValue = value;
      if ( this.Id ) {
        updateValue._id = this.Id;
      }
      this.loading = true;
      if ( this.Id ) {
        // update personal details
        this.updateUser(updateValue);
      } else {
        // updateValue['unique_keyword'] = updateValue.title.replace(/\s/g, '_');
        this.save(updateValue);
      }
    
    }
  }

  save(value) {
    this._service.save(value)
      .subscribe(
        ( data: any) => {
          console.log('data', data);
          this.loading = false;
          if ( data.code == 400 ) {
            // this.responseService.handleErrorResponse(data);
          } else {
            this.dialogRef.close();
            this.router.navigate(['/secure/manage-riskpal/email-template']);
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
  closeModal() {
    this.dialogRef.close();
  }
  updateUser(value) {
    this._service.update(value)
      .subscribe(
        ( data: any) => {
          console.log('data', data);
          this.loading = false;
          if ( data.code == 400 ) {
            // this.responseService.handleErrorResponse(data);
          } else {
            this.dialogRef.close();
            // this.responseService.hanleSuccessResponse(data);
            this.router.navigate(['/secure/manage-riskpal/email-template']);
          }
        },
        error => {
          this.loading = false;
          console.log('error', error);
          // this.responseService.handleErrorResponse(error.error);
        }
      );
  }

  setFormValue(data) {
    const userValue = {
      title: data.title,
      subject: data.subject,
      description: data.description,
      unique_keyword: data.unique_keyword
    };
    this.formGroup.patchValue(userValue);
  }

}
