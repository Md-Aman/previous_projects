import { Component, OnInit } from '@angular/core';
import { UserFeatureService } from '../service/user-feature.service';
import { ConstantType } from '@app/core/services/constant.type';
import { AuthService } from '@app/core/guards/auth.service';
import { ToastarService } from '@shared/services/toastr/toastar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseService } from '@shared/services/response-handler/response.service';
import { MatDialog } from "@angular/material";
import { CreateGroupComponent } from './create-group/create-group.component';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  searchUserGroupForm:FormGroup;
  rows: any = [];
  columns: any = [
    { name: 'group_name', prop: 'Group Name' },
    { name: 'type', prop: 'Group Type' },
    { name: 'client_name', prop: 'Client Name' },
  ];

  page: any = { count: 0, offset: 0, pageSize: ConstantType.limit };
  loading: Boolean = false;
  searchKeyword: String = '';
  constructor(private userService: UserFeatureService, private authService: AuthService,private formBuilder:FormBuilder,
    private toastarService: ToastarService, private router: Router, private responseService: ResponseService,
    private activeRoute: ActivatedRoute,  private dialog: MatDialog) { }

  ngOnInit() {
    const popup = this.activeRoute.snapshot.paramMap.get('popup'); // if needs to open popup using route
    const groupId = this.activeRoute.snapshot.paramMap.get('id'); // get user id from parent component
    if ( popup ) {
      setTimeout(() => this.dialog.open(CreateGroupComponent, {
        data: {
          id: groupId ? groupId : ''
        },
        height: '100vw',
        width: '70%',
        disableClose: true,
        closeOnNavigation: true,
        position: {
          top: '0',
          right: '0',
          bottom: '0'
        }
      }));
    } // else {
      const data = [
        { name: 'User', url: '/secure/user' },
        { name: 'Group', url: '/secure/user/group' }
      ];
      this.responseService.createBreadCrum(data);
      this.getAllUsersGroup();
    // }

    this.searchUserGroupForm = this.formBuilder.group({
      searchKey: [null, []]
    });
  }
  onSearch(value) {
    this.searchKeyword = value;
    this.getAllUsersGroup(value);
  }
  getAllUsersGroup(keyword: String = "", page: Number = 1) {
    // const clientId = this.authService.getUser().client_id;
    const data = {
      // client_id: clientId,
      count: ConstantType.limit,
      page: page,
      keyword: keyword,
      sortby: ConstantType.sortCreatedAtDesc,
    };
    this.loading = true;
    this.userService.getAllUserGroups(data)
      .subscribe(
        (res: any) => {
          this.page.count = res.count;
          this.rows = res.data.map(item => {
            if ( item.client_id ) {
              item.client_name =  item.client_id.company_name;
            } else {
              item.client_name = 'N/A';
            }
            return item;
          });
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
  }
  receiveEvent(value) {
    // check for different event like edit, delete etc
    switch (value.type) {
      case 'delete':
        this.deleteUserGroup(value);
        break;
      case 'edit':
        this.editUserGroup(value);
        break;
      case 'setPage':
        this.setPage(value);
        break;
      default:
        break;
    }
  }
  editUserGroup(user) {
    this.router.navigate(['/secure/user/group/update/' + user.data._id + '/true']);
  }
  deleteUserGroup(rec) {
    // super_admin/deleteUsers/5be94f450d359b463a974f5c
    this.loading = true;
    this.userService.deleteUserGroup( rec.data._id )
      .subscribe(
        (res: any) => {
          if ( res.code === 200 ) {
            this.rows = this.rows.filter(item => item._id !== rec.data._id );
            const msg = 'User Group Record Deleted Successfuly.';
            // this.toastarService.showNotification(msg, 'success');
          } else {
            const msg = 'There is some error, please try again later.';
            // this.toastarService.showNotification(msg, 'error');
          }
          this.loading = false;
        },
        error => {
          const msg = 'There is some error, please try again later.';
          // this.toastarService.showNotification(msg, 'error');
          this.loading = false;
        }
      );
  }
  /**
   * Populate the table with new data based on the page number from backend
   * @param page The page to select
   */
  setPage ( pageInfo ) {
    console.log('page', pageInfo);
    this.getAllUsersGroup(this.searchKeyword, pageInfo.data.offset + 1);
  }
}
