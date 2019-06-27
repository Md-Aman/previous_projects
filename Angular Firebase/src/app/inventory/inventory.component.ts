import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
interface Inventory {
  id: string;
  item_name: string,
  is_checked: boolean;
}
@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  @ViewChild("desciption") desp: ElementRef
  items_available: any;
  items_unavailable: any;
  postsCol: AngularFirestoreCollection<Inventory>;

  register: FormGroup;
  submitted = false;

  item_name: string;
  constructor(public afs: AngularFirestore,
    public router: Router,
    private formBuilder: FormBuilder
  ) { }

  // , ref => ref.where('is_checked', '==', true)
  ngOnInit() {
    if(localStorage.getItem('userId') == null){
      this.router.navigate(['']);
    }
    this.postsCol = this.afs.collection('inventory', ref => ref.orderBy('item_name', 'asc').where('is_checked', '==', true));
    this.items_available = this.postsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Inventory;
          const id = a.payload.doc.id;
          return { id, data };
        });
      });

    this.postsCol = this.afs.collection('inventory', ref => ref.orderBy('item_name', 'asc').where('is_checked', '==', false));
    this.items_unavailable = this.postsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Inventory;
          const id = a.payload.doc.id;
          return { id, data };
        });
      });

    this.register = this.formBuilder.group({
      ItemDescription: ['', [Validators.required]]
    });

  }

  onSubmitItem() {
    this.submitted = true;
    console.log("item price :", this.item_name);
    if (this.register.valid) {
      this.afs.collection('inventory').add({
        'item_name': this.item_name,
        'is_checked': true
      })
    }
    // this.register.reset();
    // return false;
    this.desp.nativeElement.value = "";
  }
  get f() {
    return this.register.controls;
  }
  getAvailableItemId(itemId, itemName) {
      this.afs.collection('inventory').doc(itemId).set({
        'item_name':itemName,
        'is_checked': false
      })
  }

  getUnavailableItemId(itemId, itemName) {
      this.afs.collection('inventory').doc(itemId).set({
        'item_name':itemName,
        'is_checked': true
      })
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

}
