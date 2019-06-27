import { Component, OnInit } from '@angular/core';
import { IndexService } from '../service/index.service';
import { ConstantType } from '@app/core/services/constant.type';
import { AuthService } from '@app/core/guards/auth.service';
import { ToastarService } from '@shared/services/toastr/toastar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseService } from '@shared/services/response-handler/response.service';
import { MatDialog } from "@angular/material";
import { CreateComponent } from './../create/create.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  rows: any = [];
  columns: any = [
    { name: 'unique_keyword', prop: 'KeyWord' },
    { name: 'title', prop: 'Title' },
    { name: 'subject', prop: 'Subject' },
    { name: 'description', prop: 'Description' },
    { name: 'status', prop: 'Status' },
  ];
  actions: Array<Object> = [
    { type: 'edit', text: 'Edit', icon: true, confirm: false, class: '_edit' }
  ];
  page: any = { count: 0, offset: 0 };
  loading: Boolean = false;
  searchKeyword: String = '';
  constructor(private _service: IndexService, private authService: AuthService,
    private toastarService: ToastarService, private router: Router, private responseService: ResponseService
    , private activeRoute: ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit() {
    const popup = this.activeRoute.snapshot.paramMap.get('popup'); // if needs to open popup using route
    const Id = this.activeRoute.snapshot.paramMap.get('id'); // get user id from parent component
    console.log('popup', popup);
    if (popup) {
      setTimeout(() => this.dialog.open(CreateComponent, {
        data: {
          id: Id ? Id : '',
          comingFromOtherPage: false
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
    } else {
      const data = [
        { name: 'Email Template', url: '/secure/manage-riskpal/email-template' }
      ];
      this.responseService.createBreadCrum(data);
      this.getAllEmailTemplate();
    }
  }
  onSearch(value) {
    this.searchKeyword = value;
    this.getAllEmailTemplate(value);
  }
  getAllEmailTemplate(keyword: String = "", page: Number = 1) {
    const data = {
      count: 20,
      page: page,
      keyword: keyword,
      sortby: ConstantType.sortCreatedAtDesc,
    };
    this.loading = true;
    this._service.getAll(data)
      .subscribe(
        (res: any) => {
          this.page.count = res.count;
          this.rows = res.data.map(item => {
            if (item.status === 'Active') {
              item.status = '<span class="active">Active</span>';
            } else {
              item.status = '<span class="inactive">Inctive</span>';
            }
            return item;
          });
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
    this.router.navigate(['/secure/manage-riskpal/email-template/update/' + user.data._id + '/true']);
  }

  createNewTemplate() {
    this.router.navigate(['/secure/manage-riskpal/email-template/create/true']);
  }
  /**
   * Populate the table with new data based on the page number from backend
   * @param page The page to select
   */
  setPage(pageInfo) {
    console.log('page', pageInfo);
    this.getAllEmailTemplate(this.searchKeyword, pageInfo.data.offset + 1);
  }
}
