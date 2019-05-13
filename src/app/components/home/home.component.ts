import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BusService} from "../../services/bus.service";
import {EventsService} from "../../services/events.service";
import {Router} from "@angular/router";
import {Car} from "../../interfaces/car";
import {AppConfig} from "../../app.config";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  public isLoggedIn = false;
  public email = '';
  public cars: Car[] = [];
  public apiUrl: string = AppConfig.apiUrl;

  constructor(
    private router: Router,
    private bus: BusService,
    private eventService: EventsService
  ) {
  }

  private setLoggedIn(data): void {
    this.isLoggedIn = data;
  }

  public logOut(): void {
    localStorage.removeItem('currentUser');
    this.bus.publish(this.eventService.notified.authentication, false, this);
    this.router.navigate(['/login']);
  }

  public onSearchChange(value){
    console.log(1, value);
  }

  public setCars(data){
    console.log(data);
    this.cars = data;
  }

  public getCars(){
    this.bus.publish(this.eventService.requested.data.car.all, this);
  }

  public subscribe(): void {
    this.bus.subscribe(this.eventService.notified.authentication, this.setLoggedIn, this);
    this.bus.subscribe(this.eventService.received.data.car.all, this.setCars, this);
  }

  public unSubscribe(): void {
    this.bus.unsubscribe(this.eventService.notified.authentication, this.setLoggedIn);
    this.bus.unsubscribe(this.eventService.received.data.car.all, this.setCars);
  }

  ngOnInit(): void {
    this.subscribe();
    this.getCars();
    if (localStorage.getItem('currentUser')) {
      this.email = JSON.parse(localStorage.getItem('currentUser')).email;
      this.bus.publish(this.eventService.notified.authentication, true, this);
    } else {
      this.bus.publish(this.eventService.notified.authentication, false, this);
    }
  }

  ngOnDestroy(): void {
    this.unSubscribe();
  }

}
