import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from './../../../core/guards/auth.service';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastarService } from '@shared/services/toastr/toastar.service';
import { Router } from '@angular/router';
import { environment } from './../../../../environments/environment';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    withCredentials: boolean = true;
    constructor(private cookie: CookieService, private toasterService: ToastarService, private authService: AuthService,
            private router: Router  ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getUser();
        // const token: string = localStorage.getItem('token');
        if (environment.production === false) {
            this.withCredentials = false;
        }
        if (token) {
            request = request.clone({ withCredentials: this.withCredentials, headers: request.headers.set('Authorization', token) });
        }
        // request = request.clone({ headers: request.headers.set('Origin', 'https://dev.riskpal.co.uk') });
        // if (!request.headers.has('Content-Type')) {
        //     request = request.clone({ headers: request.headers.set('Content-Type', 'multipart/form-data') });
        // }
        // request = request.clone({ headers: request.headers.set('Accept', 'multipart/form-data') });

        request = request.clone({ headers: request.headers.set('xsrf-token', this.cookie.get('csrf-token')) });
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if ( event.body.code == 401 ) {
                        this.authService.removeUser();
                        this.router.navigate(['/login']);
                    }
                    // console.log('event--->>>', event);
                    // this.errorDialogService.openDialog(event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                let data = {};
                const reason = error && error.error.reason ? error.error.reason : '';
                data = {
                    reason: error && error.error.reason ? error.error.reason : '',
                    status: error.status
                };
                // this.toasterService.showNotification(reason, 'error');
                return throwError(error);
            }));
    }
}