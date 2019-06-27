import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';

import { formatDate } from '@angular/common';
import { MatDialog, MatDialogRef } from "@angular/material";
import { ChangePasswordComponent } from "./../change-password/change-password.component";

import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
interface Item {
  id: string;
  user_id: string,
  item_description: string;
  item_price: string;
  date_time: string;
}
interface User {
  user_id: string;
  name: string;
}
@Component({
  selector: 'items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  @ViewChild("desciption") desp: ElementRef
  @ViewChild("price") pr: ElementRef

  items: any;
  userName: any;
  // datas: AngularFireList<any[]>;
  data: any[];
  postsCol: AngularFirestoreCollection<Item>;
  postsDoc: AngularFirestoreDocument<Item>;
  usersUpdate: Observable<Item>;

  users: AngularFirestoreCollection<User>;

  view: boolean = false;
  updateDa: any;

  // createNewData: boolean = false;
  register: FormGroup;
  // updater: FormGroup;

  submitted = false;
  constructor(
    public afs: AngularFirestore,
    public router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) {
  }


  item_description: string;
  item_price: number;
  today = new Date();
  date_time = '';
  logOut() {
    firebase.auth().signOut();
    localStorage.clear();
    this.router.navigate(['']);
  }
  // isUser: boolean;
  total_price: number = 0;
  user_email: string;
  userData: any;

  ngOnInit() {

    // setTimeout(() => this.dialog.open(ChangePasswordComponent,{ disableClose: true }))
   
    if (localStorage.getItem('userId') == null) {
      this.router.navigate(['']);
    }

    this.users = this.afs.collection('users', ref => ref.where('user_id', '==', localStorage.getItem('userId')));
    this.userName = this.users.valueChanges().subscribe(users => {
      this.userData = users;
      localStorage.setItem('userName', this.userData[0].name);
    })

    this.postsCol = this.afs.collection('items', ref => ref.where('user_id', '==', localStorage.getItem('userId')));
    this.items = this.postsCol.valueChanges();
    this.items.subscribe(items => {
      for (let item of items) {
        this.total_price += item.price;
      }
    });

    var user = firebase.auth().currentUser;


    // if (user == null) {
    //   this.router.navigate(['']);
    // } else {

    // this.items = this.postsCol.snapshotChanges()
    //   .map(actions => {
    //     return actions.map(a => {
    //       const data = a.payload.doc.data() as Item;
    //       this.object_length = Object.keys(data);
    //       const id = a.payload.doc.id;
    //       return { id, data };
    //     });
    //   });
    this.register = this.formBuilder.group({
      ItemDescription: ['', [Validators.required]],
      Price: ['', [Validators.required]]
    });

    // this.updater = this.formBuilder.group({
    //   namer: ['', [Validators.required]],
    //   companyr: ['', [Validators.required]],
    //   addressr: ['', [Validators.required]],
    // });
    // if(user != null){
    //    this.isUser = true;
    // } else {
    //   this.isUser = false;
    // }
    // }
  }




  // namer: string;
  // companyr: string;
  // addressr: string;
  get f() { return this.register.controls; }
  // get g() { return this.updater.controls; }

  onSubmitItem() {
    this.submitted = true;
    this.date_time = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', 'GMT+8');
    // doc('my-custom-id').set({}) for update or reset
    if (this.register.valid) {
      this.total_price = 0;
      this.afs.collection('items').add({
        'user_id': localStorage.getItem('userId'),
        'item_description': this.item_description,
        'price': this.item_price,
        'date_time': this.date_time
      })
    }
    // this.register.reset();
    // return false;
    this.desp.nativeElement.value = "";
    this.pr.nativeElement.value = "";
  }
  dashboard() {
    this.router.navigate(['dashboard']);
  }
  myHistory() {
    this.router.navigate(['items']);
  }
  inventory(){
    this.router.navigate(['inventory']);
  }
  // deleteDoc(id) {
  //   this.afs.collection('users').doc(id).delete();
  // }

  updateId: string;
  update(id) {
    this.updateId = id;
    this.view = true;
    this.postsDoc = this.afs.collection('users').doc(id);
    // this.postsDoc = this.afs.doc('posts/'+id);
    this.updateDa = this.postsDoc.valueChanges().subscribe(updateData => {
      this.updateDa = updateData;
      // this.namer = this.updateDa.username;
      // this.companyr = this.updateDa.company;
      // this.addressr = this.updateDa.location;
    })
  };
  //   console.log(" this.usersUpdate :", this.usersUpdate);
  //   this.usersUpdate.subscribe(updateData => {
  //     this.updateDa = updateData;
  //     console.log("this.updateDa :", this.updateDa.company);
  //   })
  // }

  // onUpdate() {
  //   if (this.updater.valid) {
  //     this.afs.collection('users').doc(this.updateId).set({
  //       'username': this.namer,
  //       'company': this.companyr,
  //       'location': this.addressr
  //     })
  //   }

  // }

}
