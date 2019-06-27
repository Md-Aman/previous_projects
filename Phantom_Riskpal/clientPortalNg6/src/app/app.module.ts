import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';

import { AppRouters } from './app.routing';
import { AuthGuard } from './core/guards/auth.guard';
import { CookieService } from 'ngx-cookie-service';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrModule } from 'ngx-toastr';

import { AuthService } from './core/guards/auth.service';
import { HttpConfigInterceptor } from './shared/services/interceptor/httpconfig.interceptor';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { CommonComponentModule } from '@shared/components/common/common.component.module';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
// import { faTachometerAlt } from '@fortawesome/pro-light-svg-icons';
@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    CoreModule,
    AppRouters,
    TooltipModule.forRoot(),
    ToastrModule.forRoot(),
    CommonComponentModule,
    AngularFontAwesomeModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
  ],
  entryComponents: [ConfirmationDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
