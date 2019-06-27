import { Component, OnInit } from '@angular/core';
import { ItemService } from './../services/item-service/item.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

interface Item {
  id: string;
  user_id: string,
  item_description: string;
  item_price: string;
  date_time: string;
}
interface User{
  user_id:string;
  name:string;
}
@Component({
  selector: 'individual-item-history',
  templateUrl: './individual-item-history.component.html',
  styleUrls: ['./individual-item-history.component.css']
})
export class IndividualItemHistoryComponent implements OnInit {
  postsCol: AngularFirestoreCollection<Item>;
  users: AngularFirestoreCollection<User>;
  items:any;
  userName:any;
  total_price: number = 0;
  user_name:string;
  userData: any;
  constructor(public itemService:ItemService, public afs:AngularFirestore, public router:Router ) {
    
   }

  ngOnInit() {
    if(localStorage.getItem('userId') == null){
      this.router.navigate(['']);
    }
    if(this.itemService.user_id_for_individual_user_history == undefined){
        this.router.navigate(['dashboard']);
    }else{
      this.users = this.afs.collection('users',ref => ref.where('user_id', '==', this.itemService.user_id_for_individual_user_history));
      this.userName = this.users.valueChanges().subscribe(users =>{
         this.userData = users;
      })

    this.postsCol = this.afs.collection('items', ref => ref.where('user_id', '==', this.itemService.user_id_for_individual_user_history).orderBy('date_time','desc'));
    this.items = this.postsCol.valueChanges();
    this.items.subscribe(items => {
      for (let item of items) {
        this.total_price += item.price;
      }
    });
  }
}

logOut() {
  firebase.auth().signOut();
  localStorage.clear();
  this.router.navigate(['']);
}
dashboard(){
  this.router.navigate(['dashboard']);
}
myHistory(){
  this.router.navigate(['items']);
}
inventory(){
  this.router.navigate(['inventory']);
}
}
