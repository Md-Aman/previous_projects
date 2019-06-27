import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { IndexService } from '../service/index.service';

import { ResponseService } from '@shared/services/response-handler/response.service';
import { AuthService } from '@app/core/guards/auth.service';
import { ConstantType } from '@app/core/services/constant.type';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
  question: any = {};
  categories: any;
  comingFromOtherPage: any = false;
  @Input() comingFromOtherPageInput: any = false;
  @Input() isUpdateBreadCrum: boolean = true;
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
    console.log("data :", this.data);
    // this.Id = this.activeRoute.snapshot.paramMap.get('id'); // get user id from parent component
    this.Id = this.data.id;
    this.comingFromOtherPage = this.data.comingFromOtherPage;
    if (this.comingFromOtherPageInput) {
      this.comingFromOtherPage = this.comingFromOtherPageInput;
    }
    this.currentUser = this.authService.getUser();
    this.buildForm();
    let breadCrumName = 'Create';
    let url = '/secure/manage-riskpal/question/create';
    if (this.Id) {
      breadCrumName = 'Update';
      url = '/secure/manage-riskpal/question/update/' + this.Id;
      this.getDetails(this.Id);
    }
    const data = [
      { name: 'Question', url: '/secure/manage-riskpal/question' },
      { name: breadCrumName, url: url }
    ];
    if (this.isUpdateBreadCrum) {
      this.responseService.createBreadCrum(data);
    }
    this.preLoadData();
  }
  preLoadData() {
    this.loading = true;
    this._service.getCategories({})
      .subscribe(
        (data: any) => {
          this.categories = data.data;
          this.loading = false;
        },
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse({message: 'There is some error while pre populating data. please try again later.'});
        }
      );
  }
  getDetails(id) {
    this.loading = true;
    this._service.getSingleQuestion(id)
      .subscribe(
        (data: any) => {
          console.log('userdetails', data);
          this.question = data.data;
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
      question: ['', [
        Validators.required,
        Validators.minLength(minLength)
      ]],
      best_practice_advice: ['', [
        Validators.required,
        Validators.minLength(minLength)
      ]],
      category_id: ['', [Validators.required]]
    });
  }

  // save data
  submit(value) {
    if (this.formGroup.valid) {
      // create data according to backend
      const updateValue = value;
      if (this.Id) {
        updateValue._id = this.Id;
      }
      this.loading = true;
      if (this.Id) {
        // update personal details
        this.updateUser(updateValue);
        console.log('updated');
      } else {
        this.save(updateValue);
      }
      console.log('value', updateValue);
    }
    console.log('value', value);
  }

  save(value) {
    this._service.save(value)
      .subscribe(
        (data: any) => {
          console.log('data', data);
          this.loading = false;
          if (data.code == 400) {
            // this.responseService.handleErrorResponse(data);
          } else {
            this.dialogRef.close();
            if (this.comingFromOtherPage || this.comingFromOtherPage === 'true') {

              this.raService.setSubject({
                type: 'updateTemplateRisk'
              });
            } else {
              this.router.navigate(['/secure/manage-riskpal/question']);
            }
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
    this.raService.setSubject({ type: 'reloadPage' });
  }
  updateUser(value) {
    this._service.update(value)
      .subscribe(
        (data: any) => {
          console.log('data', data);
          this.loading = false;
          if (data.code == 400) {
            // this.responseService.handleErrorResponse(data);
          } else {
            this.raService.setSubject({
              type: 'updateQuestionList'
            });
            this.dialogRef.close();
            // this.responseService.hanleSuccessResponse(data);
            // this.router.navigate(['/secure/manage-riskpal/question']);
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
    console.log('data', data);
    const userValue = {
      question: data.question,
      best_practice_advice: data.best_practice_advice,
      category_id: data.category_id
    };
    console.log('userValue', userValue);
    this.formGroup.patchValue(userValue);
  }

}
