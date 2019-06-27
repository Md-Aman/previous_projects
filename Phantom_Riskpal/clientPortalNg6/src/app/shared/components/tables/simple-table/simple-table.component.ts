import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatDialogRef } from "@angular/material";
@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./simple-table.component.scss']
})
export class SimpleTableComponent implements OnInit {
  @Input() rows: Array<Object>;
  @Input() actions: Array<Object> = [
    { type: 'edit', text: 'Edit', icon: true, confirm: false, class: '_edit' },
    { type: 'delete', text: 'Delete', icon: true, confirm: true, class: '_delete' }
  ];
  @Input() columns: Array<Object>;
  @Input() page: any = { pageSize: 5, count: 0, offset: 0 };
  @Input() customStyle: any;
  @Output() emitEventChange: EventEmitter<Object> = new EventEmitter();
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  @Input() checkRaStatus: boolean = false;
  @Input() hideEditIcon: boolean = false;
  @Input() isCollapse: boolean = false;
  @ViewChild('myTable') table: any;
  @Input() colHead: any = [];
  @Input() messages = {
    emptyMessage: "No data to display"
  }
  @Input() colHeadSub1: any = [];
  @Input() popupMessage: string;
  defaultMessage: string;
  // example for customStyle data
  //   customStyle = [{field: 'status', style: [{
  //       forStatus: 'approved',
  //       class: 'brdr-green'
  //     },
  //     {
  //       forStatus: 'unread',
  //       class: 'brdr-red'
  //     }
  // ]}];
  //   customStyle = [{field: 'gender', style: 'greeeeeeeeen'},
  //   {field: 'status', style: [{
  //           forStatus: 'approved',
  //           class: 'brdr-green'
  //         },
  //         {
  //           forStatus: 'unread',
  //           class: 'brdr-red'
  //         }
  //     ]}
  // ];

  constructor(public dialog: MatDialog) { }

  ngOnInit() {

  }
  confirmDialog(row, type) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    console.log("row type :", row, type);
    this.dialogRef.componentInstance.confirmMessage = this.getPopupMessage(row, type);
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.emitEvent(row, type);
        // do confirmation actions
      }
      this.dialogRef = null;
    });
  }

  getPopupMessage(row: any, type: string, ) {
    this.defaultMessage = 'Are you sure you want to delete?';
    if (type === 'userStatus') {
      if (row.statusToUse == 'Inactive') {
        return this.popupMessage.replace('inactivate', 'activate');
      } else {
        return this.popupMessage;
      }
    } else if (type === 'deactivate') {
      if(row.status === 'Expired'){
        return this.popupMessage.replace('deactivate', 'activate');
      } else {
        return this.popupMessage;
      }
    } else if(type == 'annonymised'){
      return this.defaultMessage.replace('delete', 'permanently delete this user account?');
    } else {
      return this.defaultMessage;
    }

  }
  /**
   * emit event to parent component with data and type of event like delete, edit, view, duplicate and pagination etc
   * @params data: object
   * @params type: string
   */
  emitEvent(data, type) {
    const emitObj = {
      data: data,
      type: type
    };
    this.emitEventChange.emit(emitObj);
  }
  /**
   * Populate the table with new data based on the page number from backend
   * @param page The page to select
   */
  setPage(pageInfo) {
    this.emitEvent(pageInfo, 'setPage');
  }


  toggleExpandRow(row) {
    // console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    // console.log('Detail Toggled', event);
  }
}
