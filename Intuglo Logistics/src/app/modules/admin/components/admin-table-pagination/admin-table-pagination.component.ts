import { AdminApiService } from './../../services/admin-api.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SessionStorage } from '../../../models/session-storage';

@Component({
  selector: 'admin-table-pagination',
  templateUrl: './admin-table-pagination.component.html',
  styleUrls: ['./admin-table-pagination.component.css']
})
export class AdminTablePaginationComponent implements OnInit {
  @Input() vesselID;
  @Input() supplierID;
  @Output() shareQuotationId = new EventEmitter();
  session = new SessionStorage(); //instance for session

  numberOfQuotations;
  containerLength: number = 0;
  quotationId;
  peopleShare;

  pages : number = 0;
  pageSize : number = 0;
  pageNumber : number = 0;
  currentIndex : number = 0;
  pagesIndex : Array<number>;
  pageStart : number = 1;

  show: boolean = true;

  constructor(private service: AdminApiService) { }
  
  ngOnInit() {
    this.show = true;
  }


ngOnChanges(){
  this.show = false;
  console.log('hiiii', this.vesselID);
  //get list of quotations based on selected vessel id and supplier id from first filter component
  this.service.getQuotationList(this.session.loginID,this.session.sessionID,
        this.vesselID, this.supplierID)
   .subscribe(getQuotationList => {
     this.numberOfQuotations = getQuotationList;
     this.containerLength = this.numberOfQuotations.length; //get number of quotations
     this.quotationId = this.numberOfQuotations[0]['quotation_id'];
     this.shareQuotationId.emit(this.quotationId); //share quotation id to order list component
     this.peopleShare = this.numberOfQuotations[0]['total_people_per_shipment'];

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

// create an array of pages in the pager control
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

//get previous data of previous page
prevPage(){
 let i = this.currentIndex - 1;
  if(this.currentIndex>1){
     this.currentIndex --;
     i --;
     this.quotationId = this.numberOfQuotations[i]['quotation_id'];
     this.shareQuotationId.emit(this.quotationId);
     this.peopleShare = this.numberOfQuotations[i]['total_people_per_shipment'];
  } 
  if(this.currentIndex < this.pageStart){
     this.pageStart = this.currentIndex;
  }
  this.refreshItems();
}

// get data of next page
nextPage(){
 let i = this.currentIndex - 1;
  if(this.currentIndex < this.pageNumber){
        this.currentIndex ++;
        i ++;
        this.quotationId = this.numberOfQuotations[i]['quotation_id'];
        this.shareQuotationId.emit(this.quotationId);
        this.peopleShare = this.numberOfQuotations[i]['total_people_per_shipment'];

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
