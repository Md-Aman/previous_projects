import { Component, OnInit } from '@angular/core';
import { DepartmentService } from './services/department.service';
import { AuthService } from './../../core/guards/auth.service';
import { MatDialog } from "@angular/material";
import { DepartmentFormComponent } from './department-form/department-form.component';
import { ToastarService } from './../../shared/services/toastr/toastar.service';
import { ConstantType } from './../../core/services/constant.type';
import { Subscription } from 'rxjs/Subscription';
import { ResponseService } from './../../shared/services/response-handler/response.service';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';



@Component({
  selector: 'department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  subscription: Subscription;
  searchDeptForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private responseService: ResponseService,
    public departmentService: DepartmentService,
    public authService: AuthService,
    private toastarService: ToastarService) {
    this.subscription = this.departmentService.getUpdateDepartmentList().subscribe(updateDeptList => {
      this.ngOnInit();
    });
  }

  rows = [];
  columns: any = [
    { prop: 'Department Name', name: 'departmentName' },
    { prop: 'Approving Managers', name: 'approvingManager' },
    { prop: 'Secondary Approving Manager/s', name: 'secondaryManager' },
    // { prop: 'Status', name: 'status' }
  ];
  page: any = { count: 0, offset: 0, pageSize: ConstantType.limit };
  public loading = false;
  breadCrum = [
    { name: 'Departments', url: '/secure/department' }
  ];
  colHead: any = [
    { name: 'Who created', value: 'creatorName' },
    { name: 'When last updated', value: 'lastUpdated' },
    { name: 'Administrator', value: 'basicAdmin' },
    // { name: 'No of assigned templates' }
  ];
  messages = {
    emptyMessage: "No departments to display"
  }
  isCollapse: boolean = true;
  secondaryManagers: any = [];

  data = {
    // client_id: this.authService.getUser().client_id,
    count: ConstantType.limit,
    page: 1,
    sortby: ConstantType.sortCreatedAtDesc,
    super_admin: false
  };

  ngOnInit() {
    this.getAllDepartment(this.data);
    this.responseService.createBreadCrum(this.breadCrum);

    if (this.authService.getPermission().super_admin === true) {
      if (this.columns[0].prop != 'Client') {
        this.columns.unshift(
          { prop: 'Client', name: 'companyName' }
        )
      }
    }

    this.searchDeptForm = this.formBuilder.group({
      searchKey: [null, []]
    });

  }

  receiveEvent(deptData) {
    if (deptData.type === 'delete') {
      this.deleteDepartment(deptData.data._id);
    }
    else if (deptData.type === 'setPage') {
      this.loading = true;
      this.data['page'] = 1 + deptData.data.offset;
      this.getAllDepartment(this.data);
    }
    else if (deptData.type === 'edit') {
      this.departmentService.departmentId = deptData.data._id;
      this.dialog.open(DepartmentFormComponent, {
        height: '100vw',
        width: '70%',
        disableClose: true,
        closeOnNavigation: true,
        position: {
          top: '0',
          right: '0',
          bottom: '0'
        }
      });
    }

  }

  openDepartmentForm() {
    this.dialog.open(DepartmentFormComponent, {
      height: '100vw',
      width: '70%',
      closeOnNavigation: true,
      disableClose: true,
      position: {
        top: '0',
        right: '0',
        bottom: '0'
      }
    });
  }

  searchDept(dept_name) {
    this.loading = true;
    this.data['keyword'] = dept_name;
    this.getAllDepartment(this.data);
  }

  deleteDepartment(deptId) {
    this.departmentService.deleteDepartment(deptId).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.getAllDepartment(this.data);
          // this.toastarService.showNotification(response.message, 'success');
        } else {
          // this.toastarService.showNotification(response.err, 'warning');
        }
      },
      error => {
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      }
    )
  }

  getAllDepartment(data) {
    this.loading = true;
    this.departmentService.getAllDepartment(data).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          this.page.count = response.count;
          this.rows = response.data.map(item => {
            item.departmentName = item.department_name;
            // const final_approving_manager = item.final_approving_manager;
            // if (typeof final_approving_manager === 'object')
            if (item.final_approving_manager != null && item.final_approving_manager != undefined) {
              const fname = item.final_approving_manager.firstname ? item.final_approving_manager.firstname : '';
              const lname = item.final_approving_manager.lastname ? item.final_approving_manager.lastname : '';
              item.approvingManager = fname + ' ' + lname;
            } else {
              item.approvingManager = 'N/A';
            }
            if (item.alternative_final_approving_manager.length > 0) {
              item.alternative_final_approving_manager.forEach(element => {
                this.secondaryManagers.push(' ' + element.firstname + ' ' + element.lastname);
              });
            } else {
              this.secondaryManagers.push('N/A');
            }
            if (item.creator != undefined) {
              item.creatorName = item.creator.firstname + ' ' + item.creator.lastname;
            } else {
              item.creatorName = 'N/A';
            }
            if (item.client_id != undefined && item.client_id != null) {
              item.companyName = item.client_id.company_name;
            } else {
              item.companyName = 'N/A';
            }

            item.lastUpdated = item.updatedAt.split("T", 10)[0];
            item.basicAdmin = item.basic_admin ? item.basic_admin.firstname + ' ' + item.basic_admin.lastname : 'N/A';
            item.secondaryManager = this.secondaryManagers;
            this.secondaryManagers = [];

            return item;
          });
          console.log("data :", this.rows);
        } else {
          this.loading = false;
          // this.toastarService.showNotification(response.err, 'warning');
        }
      },
      error => {
        this.loading = false;
        // this.toastarService.showNotification(this.toastarService.errorText, 'error');
      }
    )
  }


}
