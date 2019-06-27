import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SupplierApiService } from "./../../services/supplier-api.service";
import { SessionStorage } from '../../../models/session-storage';

@Component({
  selector: 'supplier-table-pagination',
  templateUrl: './supplier-table-pagination.component.html',
  styleUrls: ['./supplier-table-pagination.component.css']
})
export class SupplierTablePaginationComponent implements OnInit {
  @Input() selectedQuotationId;
  @Output() shareContainerId = new EventEmitter();
  @Output() shareQuotationId = new EventEmitter();
  session = new SessionStorage();

  numberOfContainer;
  containerLength: number = 0;
  containerNo;
  containerId;
  quotationId;
  peopleShare;

  pages : number = 0;
  pageSize : number = 0;
  pageNumber : number = 0;
  currentIndex : number = 0;
  pagesIndex : Array<number>;
  pageStart : number = 1;

  constructor(private service: SupplierApiService) { 
  }

  ngOnInit() {
  }

  ngOnChanges(){
    if ( typeof this.selectedQuotationId != 'undefined' ) {
      this.service.getContainerList(this.session.loginID,this.session.sessionID,this.selectedQuotationId)
      .subscribe(getContainerList => {
        this.numberOfContainer = getContainerList;
        this.containerLength = this.numberOfContainer.length;
        this.containerNo = this.numberOfContainer[0]['container_no'];
        this.containerId = this.numberOfContainer[0]['container_id'];
        this.shareContainerId.emit(this.containerId);
        this.quotationId = this.numberOfContainer[0]['quotation_id'];
        this.shareQuotationId.emit(this.quotationId);
        this.peopleShare = this.numberOfContainer[0]['number_people_sharing'];
 
        this.currentIndex = 1;
          this.pageStart = 1;
          this.pageSize = this.containerLength;
 
          this.pageNumber = this.pageSize;
          if(this.pageSize != 0){
             this.pageNumber = this.pageSize;
          }
     
          if(this.pageNumber  < this.pages){
                this.pages =  this.pageNumber;
          }
        
          this.refreshItems();
      });  
    }
       
  }

 fillArray(): any{
    var obj = new Array();
    for(var index = this.pageStart; index< this.pageStart + this.pages; index ++) {
                obj.push(index);
    }
    return obj;
 }

 refreshItems(){
    this.pagesIndex =  this.fillArray();
 }

 prevPage(){
   let i = this.currentIndex - 1;
    if(this.currentIndex>1){
       this.currentIndex --;
       i --;
       this.containerNo = this.numberOfContainer[i]['container_no'];
       this.containerId = this.numberOfContainer[i]['container_id'];
       this.shareContainerId.emit(this.containerId);
       this.quotationId = this.numberOfContainer[i]['quotationId'];
       this.shareQuotationId.emit(this.quotationId);
       this.peopleShare = this.numberOfContainer[i]['number_people_sharing'];
    } 
    if(this.currentIndex < this.pageStart){
       this.pageStart = this.currentIndex;
    }
    this.refreshItems();
 }

 nextPage(){
   let i = this.currentIndex - 1;
    if(this.currentIndex < this.pageNumber){
          this.currentIndex ++;
          i ++;
          this.containerNo = this.numberOfContainer[i]['container_no'];
          this.containerId = this.numberOfContainer[i]['container_id'];
          this.shareContainerId.emit(this.containerId);
          this.quotationId = this.numberOfContainer[i]['quotationId'];
          this.shareQuotationId.emit(this.quotationId);
          this.peopleShare = this.numberOfContainer[i]['number_people_sharing'];

    }
    if(this.currentIndex >= (this.pageStart + this.pages)){
       this.pageStart = this.currentIndex - this.pages + 1;
    }

    this.refreshItems();
 }

  setPage(index : number){
       this.currentIndex = index;
       this.refreshItems();
  }

}
