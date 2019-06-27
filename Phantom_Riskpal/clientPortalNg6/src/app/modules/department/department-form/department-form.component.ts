import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../../core/guards/auth.service';
import { ToastarService } from './../../../shared/services/toastr/toastar.service';
import { DepartmentService } from './../services/department.service';
import { MatDialogRef } from "@angular/material";
import { Observable } from 'rxjs';
import { ConstantType } from '@app/core/services/constant.type';
import { ResponseService } from './../../../shared/services/response-handler/response.service';


@Component({
  selector: 'department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.scss']
})
export class DepartmentFormComponent implements OnInit {
  departmentForm: FormGroup;
  public loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private responseService:ResponseService,
    public toastarService: ToastarService,
    public departmentService: DepartmentService,
    public dialogRef: MatDialogRef<DepartmentFormComponent>
  ) { }

  userDropdownList = [];
  userlist_track = [];
  department_name: string;
  approving_manager: any;
  administartor: any;
  assigned_user = [];
  assigned_template = [];
  aditional_approving_manager = [];
  templateList = [];
  formatedAssignedUser = [];
  formatedAditionalApprovingManager = [];
  formatedTemplateList = [];
  isUpdate: boolean = false;
  deptpartmentId: string;
  super_admin: Boolean = false;
  clients: any;
  client_id: any;
  breadCrum = [
    { name: 'Departments', url: '/secure/department' },
    { name: 'Create', url: '' }
  ];

  ngOnInit() {
    this.loading = true;
    this.super_admin = this.authService.getPermission().super_admin;
    if ( this.super_admin ) {
      this.getAllClient();
    } else {
      this.preLoadData();
    }
    this.setForm();

    const minLength = ConstantType.textMinLength;
    const maxLength = ConstantType.textMaxLength;
    const specialCharactorPattern = ConstantType.specialCharactorPattern;

    this.departmentForm = this.formBuilder.group({
      DepartmentName: ['', [
        Validators.required, Validators.pattern(specialCharactorPattern),
        Validators.minLength(minLength), Validators.maxLength(maxLength)
      ]],
      ApprovingManager: [[]],
      AdditionalApprovingManager: [[]],
      Administartor: [[]],
      AssignedRATemplates: [[]],
      AssignedUsers: [[]],
      clients: ['']
    });
    console.log('this.super_admin', this.super_admin);
    if ( this.super_admin ) {
      const clientsControl = this.departmentForm.get('clients');
      clientsControl.setValidators([Validators.required]);
    } else {
      const approvingManager = this.departmentForm.get('ApprovingManager');
      approvingManager.setValidators([Validators.required]);
    }

  }
  changeClient () {
    this.preLoadData();
  }
  setForm() {
    if (this.departmentService.departmentId != undefined) {
      this.isUpdate = true;
      this.deptpartmentId = this.departmentService.departmentId;
      this.getDepartment(this.departmentService.departmentId);
      this.getRelatedUser(this.departmentService.departmentId);
      this.getRelatedTemplate(this.departmentService.departmentId);
      this.departmentService.departmentId = undefined;
      // this.preLoadData(this.authService.getUser().client_id);
      this.breadCrum[1].name = 'Update';
      this.responseService.createBreadCrum(this.breadCrum);
    } else{
      this.responseService.createBreadCrum(this.breadCrum);
    }
  }
  getAllClient() {
    this.loading = true;
    this.departmentService.getAllClients().subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
         this.clients = response.data;
        } else {
          // this.toastarService.showNotification(response.err, 'warning');
        }
      },
      error => {
        this.loading = false;
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      });
  }
  clientId = {};
  preLoadData() {
    if(this.super_admin){
      console.log("clin :", this.client_id);
      this.clientId = {
        client_id : this.client_id._id
      };
    }
    this.departmentService.getUsers(this.clientId).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          this.userDropdownList = response.data;
          this.userlist_track = response.data.filter(
            role => role.roleId.trackmanage.riskassessments === 'true' || role.roleId.trackmanage.riskassessments === '1'
          );
        } else {
          // this.toastarService.showNotification(response.err, 'warning');
        }
      },
      error => {
        this.loading = false;
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      })

    this.departmentService.getTemplates().subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.templateList = response.data;
        } else {
          // this.toastarService.showNotification(response.err, 'warning');
        }
      },
      error => {
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      });

  }
  saveNewDepartment() {
    if (this.departmentForm.valid) {
     
      this.loading = true;
      let department_data = {
        "creator": this.authService.getPermission()._id,
        "department_name": this.department_name,
        "finalam": this.approving_manager ? this.approving_manager._id : '',
        "basic_admin": this.administartor ? this.administartor._id : '',
        "alter_finalam": ConstantType.getItemIds(this.aditional_approving_manager, this.formatedAditionalApprovingManager),
        "newusers": ConstantType.getItemIds(this.assigned_user, this.formatedAssignedUser),
        "templatelist": ConstantType.getItemIds(this.assigned_template, this.formatedTemplateList)
      }
      // let client_id = this.authService.getPermission().client_id;
      if (this.super_admin) {
        // client_id = this.client_id._id;
        department_data['client_id'] = this.client_id._id;
      }
      this.departmentService.saveDepartment(department_data).subscribe(
        (response: any) => {
          this.loading = false;
          if (response.code === 200) {
            this.toastarService.showNotification(response.message, 'success');
            this.departmentService.setUpdateDepartmentList();
            this.dialogRef.close();
          } else{
            this.toastarService.showNotification(response.err, 'warning');
          }
        },
        error => {
          this.loading = false;
          this.toastarService.showNotification(this.toastarService.errorText, 'error');
        }
      )
    }
  }

  updateDepartment() {
    if (this.departmentForm.valid) {
      this.loading = true;
      const department_data = {
        "department_name": this.department_name,
        "final_approving_manager": this.approving_manager ? this.approving_manager._id : '',
        "basic_admin": this.administartor ? this.administartor._id : '',
        "alternative_final_approving_manager":
          ConstantType.getItemIds(this.aditional_approving_manager, this.formatedAditionalApprovingManager),
        "newusers": ConstantType.getItemIds(this.assigned_user, this.formatedAssignedUser),
        "templatelist": ConstantType.getItemIds(this.assigned_template, this.formatedTemplateList),
        "_id": this.deptpartmentId
      }
     // let client_id = this.authService.getPermission().client_id;
     if (this.super_admin) {
      // client_id = this.client_id._id;
      department_data['client_id'] = this.client_id._id;
    }

      this.departmentService.updateDepartment(department_data).subscribe(
        (response: any) => {
          this.loading = false;
          if (response.code === 200) {
            this.toastarService.showNotification(response.message, 'success');
            this.departmentService.setUpdateDepartmentList();
            this.dialogRef.close();
          } else{
            this.toastarService.showNotification(response.err, 'warning');
          }
        },
        error => {
          this.loading = false;
          this.toastarService.showNotification(this.toastarService.errorText, 'error');
        }
      )
    }
  }
  getDepartment(deptId) {
    this.departmentService.getDepartment(deptId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.department_name = response.data.department_name;
          this.approving_manager = response.data.final_approving_manager;
          this.aditional_approving_manager = response.data.alternative_final_approving_manager;
          this.administartor = response.data.basic_admin;
          this.client_id =  response.data.client_id ;
          this.preLoadData();
        } else {
          // this.toastarService.showNotification(response.err, 'warning');
        }
      },
      error => {
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      }
    )
  }

  getRelatedUser(deptId) {
    this.departmentService.getRelatedUser(deptId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.assigned_user = response.data;
        } else {
          // this.toastarService.showNotification(response.err, 'warning');
        }
      },
      error => {
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      }
    )
  }

  getRelatedTemplate(deptId) {
    this.departmentService.getRelatedTemplate(deptId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.assigned_template = response.data;
        } else {
          // this.toastarService.showNotification(response.err, 'warning');
        }
      },
      error => {
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      }
    )
  }

  selectAllUser(){
      this.assigned_user = this.userDropdownList.map(x => x);
  }
  unSelectAllUser(){
    this.assigned_user = [];
  }
  selectAllTemplate(){
    this.assigned_template = this.templateList.map(x=>x);
  }
  unSelectAllTemplate(){
    this.assigned_template = [];
  }
  closeModal() {
    this.breadCrum.splice(1,1);
    this.responseService.createBreadCrum(this.breadCrum);
    this.dialogRef.close();
  }

}
