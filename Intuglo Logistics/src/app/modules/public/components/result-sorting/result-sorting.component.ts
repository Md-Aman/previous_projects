import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'result-sorting',
  templateUrl: './result-sorting.component.html',
  styleUrls: ['./result-sorting.component.css']
})
export class ResultSortingComponent implements OnInit {
 // name of the type of sort by can be put inside sortByElements to call dynamically 
 sortByElements = [ ];
  constructor() { }

  ngOnInit() {
  }

}
