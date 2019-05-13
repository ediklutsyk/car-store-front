import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {BusService} from '../../services/bus.service';
import {EventsService} from '../../services/events.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less']
})
export class SignUpComponent implements OnInit, OnDestroy {
  private user = {
    email: '',
    password: '',
    confirmPassword: ''
  };
  public error = '';

  constructor(
    private eventService: EventsService,
    private bus: BusService,
  ) {
  }

  onSignUp(form: NgForm) {
    this.user.email = form.value.email;
    this.user.password = form.value.password;
    this.user.confirmPassword = form.value.confirmPassword;
    this.bus.publish(this.eventService.requested.data.user.create, this.user, this);
    console.log(this.user);
  }

  private errorHandler(data): void {
    this.error = data.error.message;
  }

  public ngOnInit(): void {
    this.bus.subscribe(this.eventService.received.error, this.errorHandler, this);
  }

  public ngOnDestroy(): void {
    this.bus.unsubscribe(this.eventService.received.error, this.errorHandler);
  }

}
