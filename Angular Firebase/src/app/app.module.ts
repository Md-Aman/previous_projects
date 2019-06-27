import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
// import { AngularFireAuth } from 'angularfire2/auth';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import * as firebase from 'firebase';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ItemsComponent } from './items/items.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// Material
import {MatExpansionModule} from '@angular/material/expansion';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';

// services
import { ItemService } from './services/item-service/item.service';
import { IndividualItemHistoryComponent } from './individual-item-history/individual-item-history.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { InventoryComponent } from './inventory/inventory.component'


const routers: Routes = [
  {
    path:"", component:LoginComponent
  },
  {
    path:"items", component:ItemsComponent
  },
  {
    path:"dashboard", component:DashboardComponent
  },
  {
    path:"user-item-histroy", component:IndividualItemHistoryComponent
  },
  {
    path:"inventory", component:InventoryComponent
  }
]
firebase.initializeApp(environment.firebase)
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    ItemsComponent,
    DashboardComponent,
    IndividualItemHistoryComponent,
    ChangePasswordComponent,
    InventoryComponent
  ],
  entryComponents: [
    ChangePasswordComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot(routers),
    MatExpansionModule,
    BrowserAnimationsModule,
    MatDialogModule


  ],
  providers: [ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
