import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {BusService} from '../bus.service';
import {EventsService} from '../events.service';
import {RequestService} from '../request.service';
import {GetOptions} from '../interfaces/request.interfaces';
import {User} from '../../interfaces/user';
import {DataService} from './data.service';

interface LoginResponse {
  id: number;
  email: string;
  token: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private options: GetOptions<LoginResponse>;

  constructor(
    private dataSharing: DataService,
    private bus: BusService,
    private events: EventsService,
    private requestService: RequestService,
    private router: Router
  ) {
    this.options = {
      url: 'login',
      handlers: {
        success: this.success.bind(this),
        error: this.error.bind(this)
      },
      headers: new HttpHeaders()
    };
    this.subscribe();
  }

  public success(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify({id: user.id, token: user.token, email: user.email, role: user.role}));
    this.bus.publish(this.events.notified.authentication, true, this);
    this.router.navigate(['']);
  }

  public error(httpErrorResponse: HttpErrorResponse): void {
    this.bus.publish(this.events.received.error, httpErrorResponse);
  }

  private request(data): void {
    console.log(1, data);
    let headers = this.options.headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', 'Basic ' + btoa(data.email + ':' + data.password));
    this.options.headers = headers;
    this.requestService.get<LoginResponse>(this.options);
  }

  public subscribe(): void {
    this.bus.subscribe(this.events.requested.data.authentication.get, this.request.bind(this));
  }
}
