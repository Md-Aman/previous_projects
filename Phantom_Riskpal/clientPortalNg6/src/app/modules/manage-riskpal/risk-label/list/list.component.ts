import { Component, OnInit } from '@angular/core';
import { RiskLabelService } from '../service/risk-label.service';
import { ConstantType } from '@app/core/services/constant.type';
import { AuthService } from '@app/core/guards/auth.service';
import { ToastarService } from '@shared/services/toastr/toastar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseService } from '@shared/services/response-handler/response.service';
import { MatDialog } from "@angular/material";
import { CreateComponent } from './../create/create.component';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  searchRiskLabelForm: FormGroup;
  rows: any = [];
  columns: any = [
    { name: 'categoryName', prop: 'Risk Label' },
    // { name: 'status', prop: 'Status' },
  ];
  colHead: any = [
    { name: 'Who created', value: 'createdBy' },
    { name: 'When last updated', value: 'lastUpdated' }
  ];
  isCollapse: boolean = true;
  page: any = { count: 0, offset: 0 };
  loading: Boolean = false;
  searchKeyword: String = '';
  constructor(private _service: RiskLabelService, private authService: AuthService, private formBuilder:FormBuilder,
    private toastarService: ToastarService, private router: Router, private responseService: ResponseService,
    private dialog: MatDialog, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    const popup = this.activeRoute.snapshot.paramMap.get('popup'); // if needs to open popup using route
    const Id = this.activeRoute.snapshot.paramMap.get('id'); // get user id from parent component
    console.log('popup', popup);
    if ( popup ) {
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
        { name: 'Risk Label', url: '/secure/manage-riskpal/risk-label' }
      ];
      this.responseService.createBreadCrum(data);
      this.getAllRiskLabel();
    }

    this.searchRiskLabelForm = this.formBuilder.group({
      searchKey: [null, []]
    });
  }
  onSearch(value) {
    this.searchKeyword = value;
    this.getAllRiskLabel(value);
  }
  getAllRiskLabel(keyword: String = "", page: Number = 1) {
    const data = {
      count: ConstantType.limit,
      page: page,
      keyword: keyword,
      sortby: ConstantType.sortCreatedAtDesc,
    };
    this.loading = true;
    this._service.getAllRiskLabel(data)
      .subscribe(
        (res: any) => {
          this.page.count = res.count;
          this.rows = res.data.map(item => {
            if(item.created_by != undefined && item.created_by != null){
              item.createdBy = item.created_by.firstname+' '+ item.created_by.lastname;
            } else {
              item.createdBy = 'N/A';
            }
            item.lastUpdated = item.updatedAt.split("T", 10)[0];
            // if ( item.status == 'Active' ) {
            //   item.status = '<span class="active">Active</span>';
            // } else {
            //   item.status = '<span class="inactive">Inctive</span>';
            // }
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
    this.router.navigate(['/secure/manage-riskpal/risk-label/update/' + user.data._id + '/true']);
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
    this.getAllRiskLabel(this.searchKeyword, pageInfo.data.offset + 1);
  }
}
