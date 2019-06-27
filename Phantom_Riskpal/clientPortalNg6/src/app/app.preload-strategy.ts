import { PreloadingStrategy, Route } from '@angular/router';

import { Observable, of, timer } from 'rxjs';
import { flatMap } from 'rxjs/operators';
export class AppPreloadingStrategy implements PreloadingStrategy {
    preload(route: Route, load: Function): Observable<any> {
        const loadRoute = (delay) => delay
            ? timer(150).pipe(flatMap(_ => load()))
            : load();
        return route.data && route.data.preload
            ? loadRoute(route.data.delay)
            : of(null);
      }
}