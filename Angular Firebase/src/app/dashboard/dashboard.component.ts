import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { ItemService } from './../services/item-service/item.service';
import * as firebase from 'firebase';
import { ngxCsv } from 'ngx-csv/ngx-csv';

interface User {
  user_id: string;
  name: string;
}
interface Item {
  id: string;
  user_id: string,
  item_description: string;
  item_price: string;
  date_time: string;
}
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users: AngularFirestoreCollection<User>;
  postsCol: AngularFirestoreCollection<Item>;
  items: any;
  userName: any;
  // datas: AngularFireList<any[]>;
  data: any[];


  user_data: any;
  user_name: string;
  constructor(public afs: AngularFirestore, public router: Router, public itemService: ItemService) {
    this.user_name = localStorage.getItem("userName");
  }

  total_price: number = 0;
  user_info: any;
  item_info: any;
  user_individual_details = [];
  total: number = 0;
  id: string;
  name: string;
  currentMonth: string;

  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  ngOnInit() {
    if (localStorage.getItem('userId') == null) {
      this.router.navigate(['']);
    }
    this.users = this.afs.collection('users', ref => ref.orderBy('name'));
    this.user_data = this.users.valueChanges();
    this.user_data.subscribe(userInfo => {
      this.user_info = userInfo;
    });

    this.currentMonth = this.monthNames[new Date().getMonth()];

    this.postsCol = this.afs.collection('items', ref => ref.orderBy('date_time'));
    this.items = this.postsCol.valueChanges();
    this.items.subscribe(items => {
      this.item_info = items;
      for (let item of items) {
        this.total_price += item.price;
      }
      console.log("data :", this.item_info, this.user_info);
      // this.user_info = this.user_info.filter(item => item.name !== 'Lutfor' && item.name !== 'Shaikot');
      for (let i = 0; i < this.user_info.length; i++) {
        this.id = this.user_info[i].user_id;
        this.name = this.user_info[i].name;
        for (let j = 0; j < this.item_info.length; j++) {
          if (this.user_info[i].user_id == this.item_info[j].user_id) {
            this.total += this.item_info[j].price;
          }
        }
        this.user_individual_details.push({ 'user_id': this.id, 'user_name': this.name, 'user_total': this.total });
        this.total = 0;
      }

    });

  }


  dashboard() {
    this.router.navigate(['dashboard']);
  }
  myHistory() {
    this.router.navigate(['items']);
  }
  inventory() {
    this.router.navigate(['inventory']);
  }
  logOut() {
    firebase.auth().signOut();
    localStorage.clear();
    this.router.navigate(['']);
  }

  getUser(userId) {
    this.itemService.user_id_for_individual_user_history = userId;
    this.router.navigate(['user-item-histroy']);
    console.log("userId :", userId);
  }
  csvData = [];
  date_time: string;
  item_description: string;
  item_price: string;

  downloadCSVfile() {
    for (let i = 0; i < this.item_info.length; i++) {
      for (let j = 0; j < this.user_info.length; j++) {
        if (this.item_info[i].user_id == this.user_info[j].user_id) {
          this.name = this.user_info[j].name;
          this.date_time = this.item_info[i].date_time;
          this.item_description = this.item_info[i].item_description;
          this.item_price = this.item_info[i].price;
        }
      }
      this.csvData.push({ 'dateTime': this.date_time, 'name': this.name, 'itemDescription': this.item_description, 'itemPrice': this.item_price });
    }

    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      noDownload: false,
      headers: ["Date & Time", "Name", "Item Description", "Price"]
    };
    const month = this.currentMonth + '2018';
    new ngxCsv(this.csvData, month , options);
  }




}
