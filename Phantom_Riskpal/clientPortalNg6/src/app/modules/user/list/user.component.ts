import { Component, OnInit } from '@angular/core';
import { UserFeatureService } from '../service/user-feature.service';
import { ConstantType } from '@app/core/services/constant.type';
import { AuthService } from '@app/core/guards/auth.service';
import { ToastarService } from '@shared/services/toastr/toastar.service';
import { Router } from '@angular/router';
import { ResponseService } from '@shared/services/response-handler/response.service';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { MatDialog } from "@angular/material";
import { EmgRecApprovalComponent } from "./../emg-rec-approval/emg-rec-approval.component";
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  searchUserForm: FormGroup;
  rows: any = [];
  columns: any = [
    { name: 'firstname', prop: 'First Name' },
    { name: 'lastname', prop: 'Surname' },
    { name: 'email', prop: 'Email' },
    { name: 'department', prop: 'Department/s' },
    { name: 'role', prop: 'Role' },
    { name: 'status', prop: 'Status' },
  ];
  messages = {
    emptyMessage: "No users to display"
  };
  actions: Array<Object> = [
    { type: 'emg_approval', text: 'View Emergency Record', icon: true, confirm: false, class: '_emg-approval' },
    { type: 'edit', text: 'Edit', icon: true, confirm: false, class: '_edit' },
    { type: 'deactivate', text: 'Deactivate', icon: true, confirm: true, class: '_deactivate' },
    { type: 'resend_email', text: 'Re-send Email', icon: true, confirm: false, class: '_resend-email' }
  ];
  colHead: any = [
    { name: 'Who created', value: 'creatorName' },
    { name: 'When created', value: 'createdAt' },
    { name: 'Profile last updated', value: 'profileLastUpdatedAt' },
  ];
  popupMessage: string = 'Are you sure you want to deactivate the user account?';
  isCollapse: boolean = true;
  page: any = { count: 0, offset: 0, pageSize: 15 };
  loading: Boolean = false;
  searchKeyword: String = '';
  currentUser: any;
  constructor(private userService: UserFeatureService, private authService: AuthService, private formBuilder: FormBuilder,
    private toastarService: ToastarService, private router: Router, private responseService: ResponseService,
    private dialog: MatDialog) { }

  ngOnInit() {
    const superAdmin = this.authService.getPermission().super_admin;
    this.currentUser = this.authService.getPermission();
    if (superAdmin) {
      this.columns.unshift({ name: 'client', prop: 'Client' });
      this.actions.splice(2,0, { type: 'annonymised', text: 'Anonymise', icon: true, confirm: true, class: '_delete' });
    } 
    // else {
    //   this.columns.push({ name: 'department', prop: 'Department/s' });
    // }
    const data = [
      { name: 'User', url: '/secure/user' }
    ];
    this.responseService.createBreadCrum(data);
    this.getAllClientUsers();

    this.searchUserForm = this.formBuilder.group({
      searchKey: [null, []]
    });

  }
  onSearch(value) {
    this.searchKeyword = value;
    this.getAllClientUsers(value);
  }
  getAllClientUsers(keyword: String = "", page: Number = 1) {
    this.loading = true;
    // const clientId = this.authService.getUser().client_id;
    const data = {
      // client_id: clientId,
      count: ConstantType.limit,
      page: page,
      keyword: keyword,
      sortby: ConstantType.sortCreatedAtDesc,
      super_admin: false
    };
    this.userService.getAllClientUser(data)
      .subscribe(
        (res: any) => {
          this.page.count = res.count;
          this.rows = this.getDataTableRows(res.data);
        },
        error => {
          this.loading = false;
        }
      );
  }
  getDataTableRows(data) {
    this.loading = false;
    if (Array.isArray(data)) {
      return data.map(item => {
        item.role = item.roleId.group_name;
        if(item.client_id == null || item.client_id == undefined){
          item.client = 'N/A';
        } else {
          item.client = item.client_id.company_name;
        }
       
        if(item.creator != undefined){
          item.creatorName = item.creator.firstname + ' ' + item.creator.lastname;
        } else {
          item.creatorName = 'N/A';
        }
        item.createdAt = item.createdAt.split("T", 10)[0];
        item.profileLastUpdatedAt = item.updatedAt.split("T", 10)[0];
        if (Array.isArray(item.department)) {
          if (item.department.length > 0) {
            if (item.department.length < 3) {
              if (item.department.length == 2) {
                item.department = item.department[0].department_name + ', ' + item.department[1].department_name;
              } else {
                item.department = item.department[0].department_name;
              }
            } else {
              item.department = item.department.length + ' departments';
            }
          }

        } else {
          item.department = 'N/A';
        }

        return item;
      });
    }
  }
  receiveEvent(value) {
    console.log('value====', value);
    // check for different event like edit, delete etc
    switch (value.type) {
      case 'annonymised':
        this.deleteUser(value);
        break;
      case 'edit':
        this.editUser(value);
        break;
      case 'setPage':
        this.setPage(value);
        break;
      case 'resend_email':
        this.reSendUserActivationEmail(value);
        break;
      case 'deactivate':
        this.deactivateUser(value);
        break;
        case 'emg_approval':
          this.emgApproval(value);
      default:
        break;
    }
  }
  emgApproval(value) {
    console.log('approval', value);
    console.log('currentUser', this.currentUser);
    this.loading = true;
    this.userService.getAccessEmergencyInfoApproval(value.data._id)
    .subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.loading = false;
          const data = response.data;
          if ( data.length > 0 ) {
            this.router.navigate(['/secure/user/update/' + value.data._id]);
          } else {
            setTimeout(() => this.dialog.open(EmgRecApprovalComponent, {
              data: {
                id: value.data._id
              },
              // height: '100vw',
              // width: '70%',
              disableClose: true,
              closeOnNavigation: true,
              // position: {
              //   top: '0',
              //   right: '0',
              //   bottom: '0'
              // }
            }));
          }
        } else {
          this.loading = false;
          this.toastarService.showNotification('Something went wrong. Please try again later.', 'info');
          console.log("not success :", response);
        }
      },
      error => {
        this.loading = false;
        console.log("error :", error);
        this.toastarService.showNotification(error.error.message, 'info');
      }
    );
  }
  deactivateUser(data) {
    this.loading = true;
    this.userService.deactivateUser(data.data)
    .subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.loading = false;
          this.getAllClientUsers();
          this.toastarService.showNotification(response.message, 'success');
          console.log("success :", response);
        } else {
          this.loading = false;
          this.toastarService.showNotification('Something happend wrong. Please try again later.', 'info');
          console.log("not success :", response);
        }
      },
      error => {
        this.loading = false;
        console.log("error :", error);
        this.toastarService.showNotification('Something happend wrong. Please try again later.', 'info');
      }
    );
  }

  reSendUserActivationEmail(data){
    this.loading = true;
    this.userService.reSendActivationEmail(data)
    .subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.loading = false;
          this.toastarService.showNotification(response.message, 'success');
          console.log("success :", response);
        } else {
          this.loading = false;
          this.toastarService.showNotification('Something happend wrong. Please try again later.', 'info');
          console.log("not success :", response);
        }
      },
      error => {
        this.loading = false;
        console.log("error :", error);
        this.toastarService.showNotification('Something happend wrong. Please try again later.', 'info');
      }
    );
  }
  
  editUser(user) {
    this.router.navigate(['/secure/user/update/' + user.data._id]);
  }
  deleteUser(rec) {
    // super_admin/deleteUsers/5be94f450d359b463a974f5c
    console.log('log delete fnc');
    const data = {
      _id: rec.data._id,
      firstname : rec.data.firstname,
      lastname : rec.data.lastname,
      email : rec.data.email,
      status: rec.data.status
    }
    this.loading = true;
    this.userService.deleteUser(data)
      .subscribe(
        (res: any) => {
          if (res.code === 200) {
            this.getAllClientUsers();
            // this.rows = this.rows.filter(item => item._id !== rec.data._id);
            // const msg = 'User Record Deleted Successfuly.';
            this.toastarService.showNotification(res.message, 'info');
          } else {
            const msg = 'There is some error, please try again later.';
            this.toastarService.showNotification(msg, 'error');
          }
          this.loading = false;
        },
        error => {
          const msg = 'There is some error, please try again later.';
          this.toastarService.showNotification(msg, 'error');
          this.loading = false;
        }
      );
  }
  /**
   * Populate the table with new data based on the page number from backend
   * @param page The page to select
   */
  setPage(pageInfo) {
    console.log('page', pageInfo);
    this.getAllClientUsers(this.searchKeyword, pageInfo.data.offset + 1);
    // this.page.pageNumber = pageInfo.offset;
    // this.serverResultsService.getResults(this.page).subscribe(pagedData => {
    //   this.page = pagedData.page;
    //   this.rows = pagedData.data; 
    // });
  }
}
