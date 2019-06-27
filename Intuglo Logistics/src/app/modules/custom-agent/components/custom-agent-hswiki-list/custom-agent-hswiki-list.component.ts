import { HSWiki } from './../../../models/hswiki';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from './../../../shared/services/shared.service';
import { Observable } from 'rxjs/Observable';
import { MatInput, MatSort, MatPaginator, MatTableDataSource, MatFormField } from '@angular/material'



@Component({
  selector: 'custom-agent-hswiki-list',
  templateUrl: './custom-agent-hswiki-list.component.html',
  styleUrls: ['./custom-agent-hswiki-list.component.css']
})
export class CustomAgentHswikiListComponent implements OnInit {

 //rawJSONHswikiList;

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