import { Component, OnInit, Input, Output, ViewChild, ViewEncapsulation, EventEmitter } from '@angular/core';
import { ConfirmationDialogComponent } from './../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatDialogRef } from "@angular/material";
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-collapsable-table',
  templateUrl: './collapsable-table.component.html',
  styleUrls: ['./collapsable-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollapsableTableComponent implements OnInit {
  @Input() rows: Array<Object>;
  @Input() columns: Array<Object>;
  @Input() page: any = { pageSize: 5, count: 0, offset: 5 };
  @Output() shareDataToParent: EventEmitter<Object> = new EventEmitter();
  @ViewChild('myTable') table: any;
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  @Input() supplierTable: boolean = false;
  @Input() riskMitigationTable: boolean = false;
  @Input() raTemplateStepSupplier: boolean = false;
  @Input() supplierTableBody: boolean = false;
  @Input() riskMitigationTableRa: boolean = false;
  @Input() dataFromSearch: boolean = false;
  @Input() columnMode: string = '';
  @Input() isModal: boolean = false;
  @Input() isExpandRow: boolean = false;
  @Input() messages = {
    emptyMessage: "No data to display"
  }


  columnAssignUnassign: string;
  constructor(public dialog: MatDialog, private cdRef: ChangeDetectorRef) {
  }

  displayedText: string = 'Remove';

  ngOnInit() {
    if (this.riskMitigationTable === true || this.dataFromSearch === true) {
      this.columnAssignUnassign = 'SELECT ANSWER';
      this.displayedText = 'Remove';
    } else if (this.raTemplateStepSupplier === true) {
      this.columnAssignUnassign = 'ASSIGN/UNASSIGN';
    }
  }

  ngAfterViewChecked() {
    if (this.isExpandRow === true) {
      if (this.table && this.table.rowDetail) {
        this.table.rowDetail.expandAllRows();
        this.cdRef.detectChanges();
      }
    }
  }

  tooltip(supplierReviews) {
    console.log("supplierReviews :", supplierReviews);
  }


  rowClass = (row) => {
    return {
      'age-is-ten': (row.age % 10) === 0
    };
  }

  onPage(event) {
    // console.log('paged!', event);
    this.shareDatatoParent(event, 'setPage');
  }
  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    // console.log('Detail Toggled', event);
  }

  shareDatatoParent(id, actionType) {
    const object = {
      id: id,
      type: actionType
    };
    this.emitEvent(object);
  }

  ba: boolean = true;
  emitEvent(object) {
    this.shareDataToParent.emit(object)
  }

  confirmDialog(id, type) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to remove?';

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.shareDatatoParent(id, type);
      }
      this.dialogRef = null;
    });
  }

  sendTypedValue(event, row) {
    if (row.specific_mitigation !== event.target.value) {
      row.specific_mitigation = event.target.value;
      this.shareDatatoParent(row, 'additionalInfo')
    }
  }

}
