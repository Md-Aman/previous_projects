import { Component, OnInit } from '@angular/core';
import { IndexService } from '../service/index.service';
import { ConstantType } from '@app/core/services/constant.type';
import { AuthService } from '@app/core/guards/auth.service';
import { ToastarService } from '@shared/services/toastr/toastar.service';
import { Router } from '@angular/router';
import { ResponseService } from '@shared/services/response-handler/response.service';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  searchCategoryForm: FormGroup;
  rows: any = [];
  columns: any = [
    { name: 'categoryName', prop: 'Category' },
    // { name: 'country', prop: 'Country' },
    // { name: 'status', prop: 'Status' }
  ];
  categories: any;
  page: any = { count: 0, offset: 0 };
  loading: Boolean = false;
  searchKeyword: String = '';
  constructor(private _service: IndexService, private authService: AuthService,private formBuilder:FormBuilder,
    private toastarService: ToastarService, private router: Router, private responseService: ResponseService) { }

  ngOnInit() {
    const data = [
      { name: 'Category', url: '/secure/manage-riskpal/category' }
    ];
    this.responseService.createBreadCrum(data);
    this.getAllCategory();

    this.searchCategoryForm = this.formBuilder.group({
      searchKey: [null, []]
    });
  }
  onSearch(value) {
    this.searchKeyword = value;
    this.getAllCategory(this.searchKeyword);
  }

  getAllCategory(keyword: String = "", page: Number = 1) {
    const data = {
      count: ConstantType.limit,
      page: page,
      keyword: keyword,
      sortby: ConstantType.sortCreatedAtDesc,
    };
    this.loading = true;
    this._service.getAllCategory(data)
      .subscribe(
        (res: any) => {
          this.page.count = res.count;
          this.rows = res.data.map(item => {
            if ( item.country.length > 1 ) {
              item.country = 'Multiple Countries';
            } else {
              item.country = item.country[0].name;
            }
            if ( item.status == 'Active' ) {
              item.status = '<span class="active">Active</span>';
            } else {
              item.status = '<span class="inactive">Inctive</span>';
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
      default:
        break;
    }
  }
  edit(user) {
    this.router.navigate(['/secure/manage-riskpal/category/update/' + user.data._id]);
  }
  delete(rec) {
    // super_admin/deleteUsers/5be94f450d359b463a974f5c
    console.log('log delete fnc');
    this.loading = true;
    this._service.delete( rec.data._id )
      .subscribe(
        (res: any) => {
          if ( res.code === 200 ) {
            this.rows = this.rows.filter(item => item._id !== rec.data._id );
            this.page.count = this.rows.length;
            const msg = 'Client Record Deleted Successfuly.';
            // this.toastarService.showNotification(msg, 'success');
          } else {
            // this.responseService.handleErrorResponse(res);
          }
          this.loading = false;
        },
        error => {
          console.log('errr', error);
          // this.responseService.handleErrorResponse(error.error);
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
    this.getAllCategory(this.searchKeyword, pageInfo.data.offset + 1);
  }
}
