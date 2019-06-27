import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Output() toggleMenuEmitter: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  emitToggleMenu() {
    this.toggleMenuEmitter.emit(true);
  }

}
