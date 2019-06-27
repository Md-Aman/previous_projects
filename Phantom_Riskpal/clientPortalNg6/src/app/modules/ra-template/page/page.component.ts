import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RaTemplateService } from './../service/ra-template.service';
import { ToastarService } from './../../../shared/services/toastr/toastar.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ConstantType } from './../../../core/services/constant.type';
import { ResponseService } from './../../../shared/services/response-handler/response.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  subscriptionRAPages: Subscription;
  // subscriptionTabChanged: Subscription;
  subsCrip: Subscription;
  raTemplateNameForm: FormGroup;

  templateName: string;
  isEdit: boolean = false;
  selectedTab = 1;
  isShowEdit = true;
  raPages: any = {};
  pages = {
    countryrequired: '',
    questionRequired: '',
    supplierRequired: '',
    communicationRequired: '',
    contingenciesRequired: ''
  };
  options = {
    selectedTab: ''
  };
  breadCrum = [
    { name: 'Risk Assessment Templates', url: '/secure/ra-template' }
  ];

  raTabChanged: any = {};
  constructor(
    private formBuilder: FormBuilder,
    public raTemplateService: RaTemplateService,
    public toastarService: ToastarService,
    public router: Router,
    private cdref: ChangeDetectorRef,
    public responseService: ResponseService
  ) {
    this.subscriptionRAPages = this.raTemplateService.currentRaChanges.subscribe(raPages => {
      this.raPages = raPages;
      if (this.raPages.type === 'raPagesOninIt') {
        this.pages.countryrequired = this.raPages.data.countryrequired;
        this.pages.questionRequired = this.raPages.data.questionRequired;
        this.pages.supplierRequired = this.raPages.data.supplierRequired;
        this.pages.communicationRequired = this.raPages.data.communicationRequired;
        this.pages.contingenciesRequired = this.raPages.data.contingenciesRequired;
        this.options.selectedTab = this.raPages.data.selectedTab;
        this.templateName = this.raPages.data.templateName;
      } else if (this.raPages.type === 'raPages') {
        this.pages = this.raPages.data;
        // this.pages.countryrequired = this.raPages.data.countryrequired;
        // this.pages.questionRequired = this.raPages.data.questionRequired;
        // this.pages.supplierRequired = this.raPages.data.supplierRequired;
        // this.pages.communicationRequired = this.raPages.data.communicationRequired;
        // this.pages.contingenciesRequired = this.raPages.data.contingenciesRequired;
      }
      else if (this.raPages.type === 'raTabChanged') {
        this.options.selectedTab = this.raPages.data.selectedTab;
      }
      // this.cdref.detectChanges();
    })
  }


  ngOnInit() {
    if (this.raTemplateService.getRaPages() != null && this.raTemplateService.getRa() != null) {
      this.templateName = this.raTemplateService.getRa().ra_name;
      this.pages = this.raTemplateService.getRaPages();
    } 
    else {
      // this.templateName = this.raTemplateService.templateName;
      this.templateName = "Risk Assessment Template";
    }
    const minLength = ConstantType.textMinLength;
    const maxLength = ConstantType.templateNameLength;
    const specialCharactorPattern = ConstantType.specialCharactorPattern;

    this.raTemplateNameForm = this.formBuilder.group({
      raTemplateName: ['', [
        Validators.required,
        Validators.minLength(minLength), Validators.maxLength(100)
      ]],
    });
    this.responseService.createBreadCrum(this.breadCrum);
  }

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }




  // unsubscribe to ensure no memory leaks

  ngOnDestroy() {
    this.subscriptionRAPages.unsubscribe();
  }

  templateNameSubmit() {
    if (this.raTemplateNameForm.valid) {
      this.setTemplateName(this.raTemplateNameForm.controls.raTemplateName.value);
      this.templateName = this.raTemplateNameForm.controls.raTemplateName.value;
      this.raTemplateService.templateName = this.raTemplateNameForm.controls.raTemplateName.value;
      this.isEdit = false;
    }
  }


  edit() {
    if(this.templateName !== "Risk Assessment Template"){
      this.setTemplateName(this.templateName);
    }
    this.isEdit = true;
  }

  setTemplateName(tempName) {
    this.raTemplateNameForm.patchValue({
      raTemplateName: tempName
    });
  }

  raTemplateNavigateStep(step) {
    if (this.raTemplateService.getRa() != null) {
      switch (step) {
        case 'country': {
          this.router.navigate(['/secure/ra-template/create/country-profile/' + this.raTemplateService.getRa().country], { queryParams: { countryProfile: this.raTemplateService.getRa().countryProfile } });
          break;
        } case 'risk': {
          this.router.navigate(['/secure/ra-template/create/risk-mitigation/' + this.raTemplateService.getRa()._id]);
          break;
        } case 'supplier': {
          this.router.navigate(['/secure/ra-template/create/supplier/' + this.raTemplateService.getRa()._id]);
          break;
        } case 'communication': {
          this.router.navigate(['/secure/ra-template/create/communication/' + this.raTemplateService.getRa()._id]);
          break;
        }
        case 'contingency': {
          this.router.navigate(['/secure/ra-template/create/contingency/' + this.raTemplateService.getRa()._id]);
          break;
        }
      }

    } else {
      // A pop up can be displayed
      console.log("A pop up can be displayed");

    }

  }


}
