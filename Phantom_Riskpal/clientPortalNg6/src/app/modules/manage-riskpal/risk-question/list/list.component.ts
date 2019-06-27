import { Component, OnInit } from '@angular/core';
import { IndexService } from '../service/index.service';
import { ConstantType } from '@app/core/services/constant.type';
import { AuthService } from '@app/core/guards/auth.service';
import { ToastarService } from '@shared/services/toastr/toastar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseService } from '@shared/services/response-handler/response.service';
import { MatDialog } from "@angular/material";
import { CreateComponent } from './../create/create.component';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { RaService } from './../../../../shared/ra/service/ra.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  subscription:Subscription;
  searchQuestionForm: FormGroup;
  rows: any = [];
  columns: any = [
    { name: 'question', prop: 'Question' },
    // { name: 'best_practice_advice', prop: 'Mitigation Advice'},
    // { name: 'status', prop: 'Status' },
    { name: 'source', prop: 'Source' },
  ];
  pageNo: number = 1;
  page: any = { count: 0, offset: 0 };
  loading: Boolean = false;
  searchKeyword: String = '';
  sectors: any = [];
  colHead: any = [
    { name: 'Mitigation Advice', value: 'ValueWithHtml' },
  ];
  colHeadSub1: any = [
    { name: 'When last updated', value: 'lastUpdated' },
  ];
  isCollapse: boolean = true;
  constructor(private _service: IndexService, private authService: AuthService,private formBuilder:FormBuilder,
    private toastarService: ToastarService, private router: Router, private responseService: ResponseService
    ,  private activeRoute: ActivatedRoute, private dialog: MatDialog, private raService:RaService) {
      this.subscription = this.raService.trackChanges.subscribe(updateTemplateRisk => {
        if (updateTemplateRisk != null) {
          if (updateTemplateRisk.type === 'updateQuestionList') {
            this.setBreadCrum();
            this.getAllSector(this.searchKeyword, this.pageNo);
          } else if(updateTemplateRisk.type === 'reloadPage'){
            this.setBreadCrum();
          }
        }
      });
     }

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
      this.setBreadCrum();
      this.getAllSector();
    }
    if(this.authService.getPermission().super_admin === true){
      this.columns.push(
        { prop: 'sector', name: 'sector' }
      )
    }
    this.searchQuestionForm = this.formBuilder.group({
      searchKey: [null, []]
    });
  }

  setBreadCrum(){
    const data = [
      { name: 'Question', url: '/secure/manage-riskpal/question' }
    ];
    this.responseService.createBreadCrum(data);
  }

  onSearch(value) {
    this.searchKeyword = value;
    this.getAllSector(value);
  }
  getAllSector(keyword: String = "", page: Number = 1) {
    const data = {
      count: ConstantType.limit,
      page: page,
      questionnaire_name: keyword,
      sortby: ConstantType.sortCreatedAtDesc,
    };
    this.loading = true;
    this._service.getAllQuestions(data)
      .subscribe(
        (res: any) => {
          this.page.count = res.count;
          this.rows = res.data.map(item => {
            if(item.created_by != undefined && item.created_by != null){
              console.log("item.created_by :", item.created_by);
              item.source = item.created_by.firstname+' '+ item.created_by.lastname;
            } else {
              item.source = 'N/A';
            }
            item.category_id.forEach(element => {
              element.sector_name.forEach(element => {
                this.sectors.push(' ' + element.sectorName);
              });
            });
            item.lastUpdated = item.updatedAt.split("T", 10)[0];
            item.ValueWithHtml = item.best_practice_advice;
            item.sector = this.sectors;
            this.sectors = [];
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
    this.dialog.open(CreateComponent,{
      height: '100vw',
      width: '70%',
      data: {
        id:  user.data._id ? user.data._id : '',
        comingFromOtherPage: true
      },
      disableClose: false,
      closeOnNavigation: true,
        position: {
          top: '0',
          right: '0',
          bottom: '0'
        }
    });
    // this.router.navigate(['/secure/manage-riskpal/question/update/' + user.data._id + '/true']);
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
    this.pageNo =  pageInfo.data.offset + 1;
    this.getAllSector(this.searchKeyword, this.pageNo);
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }
}
