import { Component, OnInit, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'admin-order-second-filter-list',
  templateUrl: './admin-order-second-filter-list.component.html',
  styleUrls: ['./admin-order-second-filter-list.component.css']
})
export class AdminOrderSecondFilterListComponent implements OnInit {
  @Output() shareOrderID = new EventEmitter();
  orderID;

  
  constructor() { }

  ngOnInit() {

  }

  onSearch(){
    this.shareOrderID.emit(this.orderID)
  }

}
