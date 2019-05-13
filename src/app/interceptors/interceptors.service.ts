import {Observable} from 'rxjs';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {of} from 'rxjs/observable/of';
import 'rxjs/add/operator/do';
import {Router} from '@angular/router';
import {BusService} from '../services/bus.service';
import {EventsService} from '../services/events.service';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private bus: BusService,
    private events: EventsService
  ) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.endsWith('/upload-file')) {
      return next.handle(req).do((event: HttpEvent<any>) => {
        return of(event);
      });
    }
    let interceptHeaders = req.headers.set('Content-Type', 'application/json');
    if (!req.url.endsWith('/login') && !req.url.endsWith('/sign-up') && !req.url.endsWith('/filter')
      && !req.url.endsWith('/equip-types') && !req.url.endsWith('/equips') && !req.url.endsWith('/jobs')) {
      interceptHeaders = interceptHeaders.set('x-code', JSON.parse(localStorage.getItem('currentUser')).token);
    }
    const modifiedRequest = req.clone({headers: interceptHeaders});
    return next.handle(modifiedRequest).do((event: HttpEvent<any>) => {
      return of(event);
    }, (error) => {
      console.log(3141, error);
      if (error.status === 401) {
        localStorage.removeItem('currentUser');
        this.bus.publish(this.events.notified.authentication, false, this);
        this.router.navigate(['/login']);
      }
    });
  }
}
