import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {EventsService} from '../../services/events.service';
import {BusService} from '../../services/bus.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {
  public error = '';

  constructor(
    private bus: BusService,
    private eventService: EventsService
  ) {
  }

  private setError(response): void {
    switch (response.status) {
      case 401 : {
        if (response.error.message !== 'Token is invalid') {
          this.error = 'Email or password are incorrect!';
        }
        break;
      }
      case 404 : {
        this.error = 'No such account!';
        break;
      }
      default: {
        this.error = 'Something go wrong';
      }
    }
  }

  public onLogin(form: NgForm): void {
    this.bus.publish(this.eventService.requested.data.authentication.get,
      {email: form.value.email.toLowerCase(), password: form.value.password}, this);
  }

  public subscribe(): void {
    this.bus.subscribe(this.eventService.received.error, this.setError, this);
  }

  public unSubscribe(): void {
    this.bus.unsubscribe(this.eventService.received.error, this.setError);
  }

  public ngOnInit(): void {
    this.subscribe();
  }

  public ngOnDestroy(): void {
    this.unSubscribe();
  }


}

