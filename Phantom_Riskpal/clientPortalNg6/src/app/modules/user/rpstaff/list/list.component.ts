import { Component, OnInit } from '@angular/core';
import { UserFeatureService } from '../../service/user-feature.service';
import { ConstantType } from '@app/core/services/constant.type';
import { ToastarService } from '@shared/services/toastr/toastar.service';
import { Router } from '@angular/router';
import { ResponseService } from '@shared/services/response-handler/response.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  rows: any = [];
  actions: any = [
    { type: 'delete', text: 'Delete', icon: true, confirm: true, class: '_delete' },
    { type: 'userStatus', text: 'Change status', icon: true, confirm: true, class: '_change' }
  ];
  popupMessage: string = 'Are you sure you want to inactivate the user account?';
  columns: any = [
    { name: 'firstname', prop: 'First Name' },
    { name: 'lastname', prop: 'Last Name' },
    { name: 'mobile_number', prop: 'Mobile Number' },
    { name: 'email', prop: 'Email' },
    { name: 'status', prop: 'Status' }
  ];
  categories: any;
  page: any = { count: 0, offset: 0 };
  loading: Boolean = false;
  searchKeyword: String = '';
  constructor(private _service: UserFeatureService,
    private toastarService: ToastarService, private router: Router, private responseService: ResponseService) { }

  ngOnInit() {
    const data = [
      { name: 'RPstaff', url: '/secure/rpstaff' }
    ];
    this.responseService.createBreadCrum(data);
    this.getAllRPstaff();
  }
  onSearch(value) {
    this.searchKeyword = value;
    this.getAllRPstaff(this.searchKeyword);
  }

  getAllRPstaff(keyword: String = "", page: Number = 1) {
    const data = {
      count: ConstantType.limit,
      page: page,
      keyword: keyword,
      sortby: ConstantType.sortCreatedAtDesc,
    };
    this.loading = true;
    this._service.getAllRPstaff(data)
      .subscribe(
        (res: any) => {
          this.page.count = res.count;
          this.rows = res.data.map(item => {
            item.statusToUse = item.status;
            if ( item.status == 'Active' ) {
              item.status = '<span class="active">Active</span>';
            } else {
              item.status = '<span class="inactive">Inactive</span>';
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
    console.log('value====', value);
    // check for different event like edit, delete etc
    switch (value.type) {
      case 'delete':
        this.delete(value);
        break;
      case 'edit':
        this.edit(value);
        break;
      case 'setPage':
        this.setPage(value);
        break;
      case 'userStatus':
        this.userActivationStatus(value);
        break;
      default:
        break;
    }
  }
  edit(user) {
    this.router.navigate(['/secure/user/rpstaff/update/' + user.data._id]);
  }
  userActivationStatus(rec){
    const data ={
      'user_id': rec.data._id,
      'status':  rec.data.statusToUse
    }
    this.loading = true;
    this._service.deActivateRPstaff(data)
      .subscribe(
        (res: any) => {
          if ( res.code === 200 ) {
            this.toastarService.showNotification(res.message, 'info');
            this.getAllRPstaff();
          } else {
            this.toastarService.showNotification('Something happend wrong. Please try again later.', 'info');
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.responseService.handleErrorResponse(error.error);
        }
      );
  }

  delete(rec) {
    this.loading = true;
    this._service.deleteUser(rec.data._id)
      .subscribe(
        (res: any) => {
          if ( res.code === 200 ) {
            this.toastarService.showNotification(res.message, 'info');
            this.getAllRPstaff();
          } else {
            this.toastarService.showNotification('Something happend wrong. Please try again later.', 'info');
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.responseService.handleErrorResponse(error.error);

        }
      );
  }
  /**
   * Populate the table with new data based on the page number from backend
   * @param page The page to select
   */
  setPage ( pageInfo ) {
    console.log('page', pageInfo);
    this.getAllRPstaff(this.searchKeyword, pageInfo.data.offset + 1);
  }

}
