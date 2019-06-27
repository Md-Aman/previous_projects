import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

interface User {
  user_id: string;
  name: string;
  is_changed_password: boolean;
}
@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  usersCol: AngularFirestoreCollection<User>;
  users: any;
  data: any[];

  register: FormGroup;
  get f() { return this.register.controls; }
  new_password: string;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    public afs: AngularFirestore,
    public router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.register = this.formBuilder.group({
      Password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.usersCol = this.afs.collection('users', ref => ref.where('user_id', '==', localStorage.getItem('userId')));

    this.users = this.usersCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          // const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return { id };
        });
      });
    console.log("bala :", this.users);
  }
  submitted: boolean = false;
  // is_password_changed: boolean = false;
  onSubmitItem(docId) {
    this.submitted = true;
    if (this.register.valid) {
      var user = firebase.auth().currentUser;
      let x = user.updatePassword(this.new_password).then(function () {
        console.log("Successfully");
        this.afs.collection('users').doc(docId).set({
          'is_changed_password': true
        })
      }).catch(function (error) {
        console.log("Failed");
      });
      console.log("xxx :", x);
    }
  }

  onCloseCancel() {
    this.dialogRef.close();
    this.router.navigate(['dashboard']);
  }
}
