import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cloud Firebase FireStore';

  constructor() {
  }

}
