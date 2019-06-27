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
  searchCountryForm: FormGroup;
  rows: any = [];
  columns: any = [
    { name: 'name', prop: 'Country' },
    { name: 'color', prop: 'CLASSIFICATION' },
  ];
  alphabets: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
                'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  countries: any;
  selectedAlphabet: String = 'A';
  page: any = { count: 0, offset: 0 };
  loading: Boolean = false;
  searchKeyword: String = 'A';
  actions: any = [
    { type: 'delete', text: 'Delete', icon: true, confirm: true, class: '_delete' },
    { type: 'edit', text: 'Edit', icon: true, confirm: false, class: '_edit' }
  ];
  constructor(private _service: IndexService, private authService: AuthService,private formBuilder:FormBuilder,
    private toastarService: ToastarService, private router: Router, private responseService: ResponseService) { }

  ngOnInit() {
    if(this.authService.getPermission().super_admin !== true){
      this.actions = [];
    }
    const data = [
      { name: 'Country', url: '/secure/manage-riskpal/country' }
    ];
    this.responseService.createBreadCrum(data);
    this.getAllCountry();
    // check if user is my travel then don't show edit and delete
    if ( !this.checkSecurity('managesystem', 'countrythreatcategories') ) {
      this.actions = [];
    }
    this.searchCountryForm = this.formBuilder.group({
      searchKey: [null, []]
    });
  }
  checkSecurity ( parent, childKey ) {
    return this.authService.checkMenuSecurity(parent, childKey);
   }
  onSearch(value) {
    this.searchKeyword = value;
    if ( value == '' ) {
      this.searchCountry('A');
    } else {
      const rows = this.countries.filter(x => x.name.toLowerCase().includes(value.toLowerCase()));
      this.rows = rows.map(item => {
        item.routerLink = `/secure/manage-riskpal/country/profile/${item._id}/false`;
        return item;
      });
      this.page.count = this.rows.length;
    }


  }
  searchCountry(value) {
    this.selectedAlphabet = value;
    const rows = this.countries.filter(x => x.name.toLowerCase().indexOf(value.toLowerCase()) === 0);
    this.rows = rows.map(item => {
      item.routerLink = `/secure/manage-riskpal/country/profile/${item._id}/false`;
      return item;
    });
    this.page.count = this.rows.length;
    console.log('rowss', this.rows);
  }
  getAllCountry(keyword: String = "", page: Number = 1) {
    const data = {
      count: ConstantType.limit,
      page: page,
      keyword: keyword,
      sortby: ConstantType.sortCreatedAtDesc,
    };
    this.loading = true;
    this._service.getAllCountry(data)
      .subscribe(
        (res: any) => {

          this.countries = res.data;
          this.searchCountry('A');
          console.log('rowwwwwww', this.rows);
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
    this.router.navigate(['/secure/manage-riskpal/country/update/' + user.data._id]);
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
    this.getAllCountry(this.searchKeyword, pageInfo.data.offset + 1);
  }
}
