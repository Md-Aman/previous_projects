import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserFeatureService } from './../../service/user-feature.service';

import { ResponseService } from '@shared/services/response-handler/response.service';
import { AuthService } from '@app/core/guards/auth.service';
import { ConstantType } from '@app/core/services/constant.type';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  userFormGroup: FormGroup;
  clients: any;
  loading: Boolean = false;
  groupId: any = '';
  specialCharactorPattern: any = '';
  userGroupDetails: any = '';
  currentUser: any;
  groupTypeArray: any = [{type: 'client'}];
  constructor(
    private formBuilder: FormBuilder,
    private userFeatureService: UserFeatureService,
    private authService: AuthService,
    private responseService: ResponseService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private dialogRef: MatDialogRef<CreateGroupComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) { }

  ngOnInit() {
    this.groupId = this.data.id; // this.activeRoute.parent.snapshot.paramMap.get('id'); // get user id from parent component
    this.currentUser = this.authService.getPermission();
    if ( this.currentUser.super_admin ) {
      this.groupTypeArray = [{type: 'default'}, {type: 'client'}];
    }
    let name = 'Create';
    let url = '/secure/user/group/create/true';
    if ( this.groupId ) {
      name = 'Update';
      url = '/secure/user/group/update/' + this.groupId + '/true';
    }
    const data = [
      { name: 'User', url: '/secure/user' },
      { name: 'Group', url: '/secure/user/group' },
      { name: name, url: url }
    ];
    this.responseService.createBreadCrum(data);
    if ( this.currentUser.super_admin ) { // if user is super admin (RPStaff)
      this.preLoadData();
    }
    
    this.buildForm();
    if ( this.groupId ) {
      this.getUserGroupDetails(this.groupId);
    }  else {
      this.autoSelectCheckbox(true, 'mytravel', 'child');
      this.autoSelectCheckbox(true, 'trackmanage', 'child');
      this.autoSelectCheckbox(true, 'myprofile', 'child');
      this.autoSelectCheckbox(true, 'managesystem', 'child');
      this.autoSelectCheckbox(true, 'userinfo', 'child');
      this.autoSelectCheckbox(true, 'analytics', 'child');
      this.autoSelectCheckbox(true, 'resourcelib', 'child');
      const userValue = {
        mytravel: true,
        trackmanage: true,
        analytics: true,
        resourcelib: true,
        userinfo: true,
        managesystem: true,
        myprofile: true,
     };
      console.log('userValue', userValue);
      this.userFormGroup.patchValue(userValue);
    }
  }
  preLoadData() {
    this.loading = true;
    this.userFeatureService.getAllClients()
      .subscribe(
        (data: any) => {
          this.loading = false;
            this.clients = data.data;
        },
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse({message: 'There is some error while pre populating data. please try again later.'});
        }
      );
  }
  // build reactive form
  buildForm() {

    let client_id = '';
    // if ( !this.currentUser.super_admin ) {
    //   client_id = this.currentUser.client_id;
    // }
    const minLength = ConstantType.textMinLength;
    const maxLength = ConstantType.textMaxLength;
    const specialCharactorPattern = ConstantType.specialCharactorPattern;
    this.specialCharactorPattern = specialCharactorPattern;
    this.userFormGroup = this.formBuilder.group({
      groupname: ['', [
          Validators.required, Validators.pattern(specialCharactorPattern),
          Validators.minLength(minLength), Validators.maxLength(maxLength)
        ]],
      typeof_group: [ '', [
        Validators.required
      ]],
      clients: [client_id],
      mytravel: [''], // my travel
      riskassessmentothers: [''],
      riskassessment: [''],
      checkinlog: [''],
      contact: [''],
      accidents: [''],
      countrylist: [''],
      suppliers: [''],
      reports: [''],

      trackmanage: [''],
      riskassessments: [''], // track and connect
      riskassessmentsoverride: [''],
      communicate: [''],
      taccidents: [''],
      medical: [''],
      currenttravel: [''],

      analytics: [''],
      traveldata: [''], // analytics section
      supplierdata: [''],
      accidentdata: [''],
      managementdata: [''],
      analyticsresoucre: [''],
      training: [''],
      appusage: [''],
      userdata: [''],

      resourcelib: [''], // resource library section
      resourcelibview: [''],
      resourcelibedit: [''],

      userinfo: [''], // user Information section
      createusers: [''],
      editusergroup: [''],
      bulkupload: [''],
      emergencyRecordApproval: [''],

      managesystem: [''],
      departments: [''], // managesystem section
      riskassessmenttemplates: [''],
      labels: [''],
      csuppliers: [''],
      emailtemplates: [''],
      editcontent: [''],
      countryinfo: [''],
      countrythreatcategories: [''],

      myprofile: [''],
      myprofileemrgncy: [''],
      myprofilemedical: [''],
      myprofiletraining: ['']
    });
    if ( this.userFormGroup.get('typeof_group').value == 'client' ) {
      const clientsControl = this.userFormGroup.get('clients');
      clientsControl.setValidators([Validators.required]);
    } else {
      const clientsControl = this.userFormGroup.get('clients');
      clientsControl.setValidators(null);
    }
  }
  closeDialog() {
    this.dialogRef.close();
    this.router.navigate(['/secure/user/group']);
  }
   // save data
  submit (value) {
    if ( this.userFormGroup.valid ) {
      // create data according to backend
      const updateValue = value;
      if ( this.groupId ) {
        updateValue._id = this.groupId;
      }
      this.loading = true;
      if ( this.groupId ) {
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
    this.userFeatureService.saveUserGroup(value)
      .subscribe(
        ( data: any) => {
          console.log('data', data);
          this.loading = false;
          if ( data.code == 400 ) {
            // this.responseService.handleErrorResponse(data);
          } else {
            this.closeDialog();
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
  updateUser(value) {
    this.userFeatureService.updateUserGroup(value)
      .subscribe(
        ( data: any) => {
          console.log('data', data);
          this.loading = false;
          if ( data.code == 400 ) {
            // this.responseService.handleErrorResponse(data);
          } else {
            this.closeDialog();
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
  /**
   * get user Data using user id for update
   */
  getUserGroupDetails(id) {
    this.loading = true;
    this.userFeatureService.getUsergroupDetails(id)
      .subscribe(
        ( data: any ) => {
          console.log('userdetails', data);
          this.userGroupDetails = data.data;
          this.setFormValue(this.userGroupDetails);
          this.loading = false;
        },
        error => {
          this.loading = false;
          // this.responseService.handleErrorResponse({message: 'There is some error while pre populating data. please try again later.'});
        }
      );
  }

  setFormValue(user) {
    console.log('user', user);
    let client_id = user.client_id;
    // if ( !this.currentUser.super_admin ) {
    //   client_id = this.currentUser.client_id;
    // }

    const userValue = {
      groupname: user.group_name,
      typeof_group: user.type,
      clients: client_id,
      mytravel: user.mytravel.parentId === 'true' || user.mytravel.parentId === '1' ? true : false,
      riskassessmentothers: user.mytravel.riskassessmentothers === 'true' || user.mytravel.riskassessmentothers === '1' ? true : false,
      riskassessment: user.mytravel.riskassessment === 'true' || user.mytravel.riskassessment === '1' ? true : false, // my travel
      checkinlog: user.mytravel.checkinlog === 'true' ||  user.mytravel.checkinlog === '1' ? true : false,
      contact: user.mytravel.contact === 'true' || user.mytravel.contact === '1' ? true : false,
      accidents: user.mytravel.accidents === 'true' || user.mytravel.accidents === '1' ? true : false,
      countrylist: user.mytravel.countrylist === 'true' || user.mytravel.countrylist === '1' ? true : false,
      suppliers: user.mytravel.suppliers === 'true' || user.mytravel.suppliers === '1' ? true : false,
      reports: user.mytravel.reports === 'true' || user.mytravel.reports === '1' ? true : false,

      trackmanage: user.trackmanage.parentId === 'true' || user.trackmanage.parentId === '1' ? true : false,
      riskassessments: user.trackmanage.riskassessments === 'true' || 
          user.trackmanage.riskassessments === '1' ? true : false, // track and connect
      riskassessmentsoverride: user.trackmanage.riskassessmentsoverride === 'true' 
        || user.trackmanage.riskassessmentsoverride === '1' ? true : false,
      communicate: user.trackmanage.communicate === 'true' || user.trackmanage.communicate === '1' ? true : false,
      taccidents: user.trackmanage.taccidents === 'true' || user.trackmanage.taccidents === '1' ? true : false,
      medical: user.trackmanage.medicalinfo === 'true' || user.trackmanage.medicalinfo === '1' ? true : false,
      currenttravel: user.trackmanage.currenttravel === 'true' || user.trackmanage.currenttravel === '1' ? true : false,

      analytics: user.analytics.parentId === 'true' || user.analytics.parentId === '1' ?  true : false,
      traveldata: user.analytics.traveldata === 'true' ||  user.analytics.traveldata === '1' ? true : false, // analytics section
      supplierdata: user.analytics.supplierdata === 'true'  || user.analytics.supplierdata === '1' ? true : false,
      accidentdata: user.analytics.accidentdata === 'true' || user.analytics.accidentdata === '1' ? true : false,
      managementdata: user.analytics.managementdata === 'true' || user.analytics.managementdata === '1' ? true : false,
      analyticsresoucre: user.analytics.analyticsresoucre === 'true' || user.analytics.analyticsresoucre === '1' ? true : false,
      training: user.analytics.training === 'true' || user.analytics.training === '1' ? true : false,
      appusage: user.analytics.appusage === 'true' || user.analytics.appusage === '1' ? true : false,
      userdata: user.analytics.userdata === 'true' || user.analytics.userdata === '1' ? true : false, 

      resourcelib: user.resourcelib.parentId === 'true' ||
        user.resourcelib.parentId === '1' ? true : false, // resource library section
      resourcelibview: user.resourcelib.resourcelibview === 'true' || user.resourcelib.resourcelibview === '1' ? true : false,
      resourcelibedit: user.resourcelib.resourcelibedit === 'true' || user.resourcelib.resourcelibedit === '1' ? true : false,

      userinfo: user.userinformation.parentId === 'true' ||
         user.userinformation.parentId === '1' ? true : false, // user Information section
      createusers: user.userinformation.createeditusers === 'true' || user.userinformation.createeditusers === '1' ? true : false,
      editusergroup: user.userinformation.editusergroup === 'true' || user.userinformation.editusergroup === '1'? true : false,
      bulkupload: user.userinformation.bulkupload === 'true' || user.userinformation.bulkupload === '1' ? true : false,
      emergencyRecordApproval: user.userinformation.emergencyRecordApproval === 'true' || user.userinformation.emergencyRecordApproval === '1' ? true : false,

      managesystem: user.managesystem.parentId === 'true' ||  user.managesystem.parentId === '1' ? true : false,
      departments: user.managesystem.departments === 'true' || user.managesystem.departments === '1'
         ? true : false, // managesystem section
      riskassessmenttemplates: user.managesystem.riskassessmenttemplates === 'true' ||
        user.managesystem.riskassessmenttemplates === '1' ? true : false,
      labels: user.managesystem.risklabels === 'true' || user.managesystem.risklabels === '1' ? true : false,
      csuppliers: user.managesystem.csuppliers === 'true' || user.managesystem.csuppliers === '1' ? true : false,
      emailtemplates: user.managesystem.emailtemplates === 'true' || user.managesystem.emailtemplates === '1' ? true : false,
      editcontent: user.managesystem.editcontent === 'true' || user.managesystem.editcontent === '1' ? true : false,
      countryinfo: user.managesystem.countryinfo === 'true' || user.managesystem.countryinfo === '1' ? true : false,
      countrythreatcategories: user.managesystem.countrythreatcategories === 'true' ||
        user.managesystem.countrythreatcategories === '1' ? true : false,

      myprofile: user.myprofile.parentId === 'true' || user.myprofile.parentId === '1' ? true : false,
      myprofileemrgncy: user.myprofile.myprofileemrgncy === 'true' ||
        user.myprofile.myprofileemrgncy === '1' ? true : false, // my profile section
      myprofilemedical: user.myprofile.myprofilemedical === 'true' || user.myprofile.myprofilemedical === '1' ? true : false,
      myprofiletraining: user.myprofile.myprofiletraining === 'true' || user.myprofile.myprofiletraining === '1' ? true : false
    };
    console.log('userValue', userValue);
    this.userFormGroup.patchValue(userValue);
  }
  autoSelectCheckbox(checked, value, type = 'parent') {
    const roles = {
      myprofile: ['myprofileemrgncy', 'myprofilemedical'
                , 'myprofiletraining', 'myprofiletraining'],
      resourcelib: ['resourcelibview', 'resourcelibedit'],
      analytics: ['traveldata', 'supplierdata', 'accidentdata',
                'managementdata', 'analyticsresoucre', 'training', 'appusage', 'userdata'],
      managesystem: ['departments', 'riskassessmenttemplates',
      'labels', 'csuppliers', 'countryinfo', 'countrythreatcategories',
      'emailtemplates', 'editcontent'],
      userinfo: ['createusers', 'editusergroup', 'bulkupload'],
      trackmanage: ['riskassessments', 'currenttravel', 'riskassessmentsoverride',
      'communicate', 'taccidents', 'medical'],
      mytravel: ['riskassessment', 'riskassessmentothers',
      'checkinlog', 'contact', 'accidents', 'countrylist', 'suppliers', 'reports']
    };
    if ( type === 'child' ) { // if selecting parent then select all child permissions auto
      const userValue = {};
      roles[value].forEach(item => {
        userValue[item] = checked;
        this.userFormGroup.patchValue(userValue);
      });
    } else {
      const userValue = {};
      const formValue = [];
      setTimeout(() => {
        roles[value].forEach(item => {
          formValue.push(this.userFormGroup.get(item).value);
        });
        if ( !formValue.includes(true) && !checked) {
          userValue[value] = false;
        } else {
          userValue[value] = true;
        }
        this.userFormGroup.patchValue(userValue);
      });
      
    }
  }
}
