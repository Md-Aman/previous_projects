import { Component, OnInit } from '@angular/core';
import { ClientService } from '../service/client.service';
import { ConstantType } from '@app/core/services/constant.type';
import { AuthService } from '@app/core/guards/auth.service';
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
  columns: any = [
    { name: 'company_name', prop: 'Company Name' },
    { name: 'sector', prop: 'Sector' },
    { name: 'status', prop: 'Status' },
  ];

  page: any = { count: 0, offset: 0 };
  loading: Boolean = false;
  searchKeyword: String = '';
  constructor(private clientService: ClientService, private authService: AuthService,
    private toastarService: ToastarService, private router: Router, private responseService: ResponseService) { }

  ngOnInit() {
    const data = [
      { name: 'Client', url: '/secure/client' }
    ];
    this.responseService.createBreadCrum(data);
    this.getAllClient();
  }
  onSearch(value) {
    this.searchKeyword = value;
    this.getAllClient(value);
  }
  getAllClient(keyword: String = "", page: Number = 1) {
    // const clientId = this.authService.getUser().client_id;
    const data = {
      // client_id: clientId,
      count: ConstantType.limit,
      page: page,
      keyword: keyword,
      sortby: ConstantType.sortCreatedAtDesc,
    };
    this.loading = true;
    this.clientService.getAllClient(data)
      .subscribe(
        (res: any) => {
          this.page.count = res.count;
          this.rows = res.data.map(item => {
            if ( item.sector_id ) {
              item.sector =  item.sector_id.sectorName;
            } else {
              item.sector = 'N/A';
            }
            if ( item.status == 'Active' ) {
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
    this.router.navigate(['/secure/client/update/' + user.data._id]);
  }
  delete(rec) {
    // super_admin/deleteUsers/5be94f450d359b463a974f5c
    console.log('log delete fnc');
    this.loading = true;
    this.clientService.delete( rec.data._id )
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
    this.getAllClient(this.searchKeyword, pageInfo.data.offset + 1);
  }
}
