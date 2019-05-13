import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {AppRoutingModule} from "./app-routing.module";
import {EventsService} from "./services/events.service";
import {BusService} from "./services/bus.service";
import {AuthService} from "./services/auth/auth.service";
import {HeadersInterceptor} from "./interceptors/interceptors.service";
import {HomeComponent} from './components/home/home.component';
import {GetAllCarsService} from "./services/car/get-all-cars.service";
import {CarsSearchService} from "./services/car/search-car.service";
import {BuyCarService} from "./services/car/buy-car.service";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    // Services
    BusService,
    EventsService,
    AuthService,

    GetAllCarsService,
    CarsSearchService,
    BuyCarService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private authService: AuthService,
    private getAllCarsService: GetAllCarsService,
    private carsSearchService: CarsSearchService,
    private buyCarService: BuyCarService,
  ) {
  }

}
