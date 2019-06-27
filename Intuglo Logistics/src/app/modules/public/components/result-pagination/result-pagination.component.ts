import { Component } from '@angular/core';

@Component({
  selector: 'result-pagination',
  templateUrl: './result-pagination.component.html',
  styleUrls: ['./result-pagination.component.css']
})
export class ResultPaginationComponent {
  collection = [];

  // Here you will be able call data from database and get the length of data 
  constructor() {
    for (let i = 1; i <= 100; i++) {
      this.collection.push(`item ${i}`);
    }
  }

}
