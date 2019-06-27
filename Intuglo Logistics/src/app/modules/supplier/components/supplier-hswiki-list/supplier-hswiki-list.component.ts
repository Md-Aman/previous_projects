import { Component, OnInit,ViewChild } from '@angular/core';
import { HSWiki } from './../../../models/hswiki';
import { SharedService } from './../../../shared/services/shared.service';
import { MatInput, MatSort, MatPaginator, MatTableDataSource, MatFormField } from '@angular/material'

@Component({
  selector: 'supplier-hswiki-list',
  templateUrl: './supplier-hswiki-list.component.html',
  styleUrls: ['./supplier-hswiki-list.component.css']
})
export class SupplierHswikiListComponent implements OnInit {

  rawJSONHswikiList;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource;
  displayedColumns = ['hs_code_header', 'hs_code_sub',
    'hs_code_item', 'unit', 'description', 'old_hs',
    'tax_import', 'tax_export', 'gst_percentage'];

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.getHSWikiListMat().subscribe(results => {
      if (!results) {
        return;
      }
      this.dataSource = new MatTableDataSource(results);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data: HSWiki, filter: string) => {
        if (data.description.trim().toLowerCase().includes(filter))
          return data;
        else if (data.hs_code_header.includes(filter))
          return data;
         switch (filter) {
           case data.hs_code_header:
             return data;
           case data.hs_code_sub:
             return data;
           case data.hs_code_item:
             return data;
           }
        };
    })
  }

}
