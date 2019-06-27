import { Component, OnInit, ApplicationRef } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';

//......
import { UserService } from './core/services/user.service';
import { AuthService } from './core/guards/auth.service';
import { Keepalive } from '@ng-idle/keepalive';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TimeoutModalComponent } from './core/timeout-modal/timeout-modal.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    subscription: Subscription;
    loadingRouteConfig: boolean;

    //.....
    status;
    idleState = 'Not started.';
    timedOut = false;
    hasIdled = false;
    lastPing?: Date = null;
    tokenExpires: any;
    popRef: MatDialogRef<TimeoutModalComponent>;
    currentPath: String;

    constructor(
        private router: Router,
        private userService: UserService,
        private authService: AuthService,
        private dialog: MatDialog,
        private idle: Idle,
        private keepalive: Keepalive,
        private applicationRef: ApplicationRef) {
        this.subscription = this.authService.getLoaderFlag.subscribe(flag => {
            if(flag === 'start'){
                this.loadingRouteConfig = true;
            } else {
                this.loadingRouteConfig = false;
            }
        })



        idle.setIdle(1200); // Executes when inactive for 20mins
        idle.setTimeout(300); // Executes a 5 minute countdown prior to Timeout
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        idle.onIdleEnd.subscribe(() => {
            this.hasIdled = false;
            this.idleState = `No longer idle.`;
            this.status = { state: this.idleState, active: this.hasIdled };
            // console.log('Act-Mon', this.status.state);
            this.popRef.close();
            this.applicationRef.tick();
        });
        idle.onTimeout.subscribe(() => {
            this.idleState = `Session expired`;
            this.timedOut = true;
            this.status = { state: this.idleState, active: false };
            this.userService.setStatus(this.status);
            // console.log("time out", this.idleState);
        });

        idle.onIdleStart.subscribe(() => {
            this.popRef = this.dialog.open(TimeoutModalComponent, {
                width: '30%',
                position: {
                    top: '5%',
                    bottom: '0'
                }
            });
            this.hasIdled = true;
            this.idleState = `You've gone idle!`;
            // this.tokenExpires = localStorage.getItem('expires_at');
            // this.status = { state: this.idleState, active: this.hasIdled, expires: this.tokenExpires };
            this.status = { state: this.idleState, active: this.hasIdled };
            this.userService.setStatus(this.status);
            // console.log("idle ", this.idleState);
        });
        idle.onTimeoutWarning.subscribe((countdown) => {
            // You will be logged out in $countdown seconds
            this.idleState = countdown;
            // this.status = { state: this.idleState, active: this.hasIdled, expires: this.tokenExpires, countdown: countdown };
            this.status = { state: this.idleState, active: this.hasIdled, countdown: countdown };
            // console.log("logged in :", this.idleState);
            this.userService.setStatus(this.status);
        });

        keepalive.interval(30); // Executes every 30 minutes
        keepalive.onPing.subscribe(() => {
            this.lastPing = new Date();
        });

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log('c', currentUser);
        if (currentUser !== null) {
            this.start();
        } else {
            this.stop();
        }

    }

    public start(): void {
        // console.log('started AM feature o');
        this.idle.watch();
        this.idleState = 'Started.';
        this.timedOut = false;
        this.status = { state: this.idleState };
        console.log("started :", this.idleState);
        this.userService.setStatus(this.status);
    }

    public stop(): void {
        this.idle.stop();
        console.log('AM feature stopped');
    }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart) {
                this.loadingRouteConfig = true;
            } else if (event instanceof RouteConfigLoadEnd) {
                this.loadingRouteConfig = false;
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
