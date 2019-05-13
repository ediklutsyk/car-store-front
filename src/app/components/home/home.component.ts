import {Component, OnDestroy, OnInit} from '@angular/core';
import {BusService} from "../../services/bus.service";
import {EventsService} from "../../services/events.service";
import {Router} from "@angular/router";
import {Car} from "../../interfaces/car";
import {AppConfig} from "../../app.config";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, OnDestroy {

  public isLoggedIn = false;
  private modalRef;
  public selectedFile: any = null;
  public previewFileSrc: string | ArrayBuffer;
  public email = '';
  public role = '';
  public cars: Car[] = [];
  public apiUrl: string = AppConfig.apiUrl;
  public brands = ['Audi', 'BMW', 'Volkswagen', 'Subaru', 'Tesla'];
  public years = [2015, 2016, 2017, 2018];
  public colors = ['White', 'Black', 'Green', 'Blue'];
  public driveTypes = ['SUV', 'HATCHBACK_3_DOORS', 'HATCHBACK_5_DOORS', 'COUPE', 'SEDAN'];
  public transportTypes = ['PASSENGER', 'TRUCK'];
  public engineTypes = ['GAS', 'DIESEL', 'ELECTRIC'];
  public passengerAmount = [3, 4, 5];
  public car: Car;
  public filter: any = {
    model: '', brands: [], years: [], colors: [], driveTypes: [],
    transportTypes: [], engineTypes: [], passengerAmount: []
  };

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private bus: BusService,
    private eventService: EventsService
  ) {
  }

  public open(content): void {
    this.modalRef = this.modalService.open(content);
  }

  public modalClose(): void {
    this.modalRef.close('Canceled');
  }

  private setLoggedIn(data): void {
    this.isLoggedIn = data;
  }

  public logOut(): void {
    localStorage.removeItem('currentUser');
    this.bus.publish(this.eventService.notified.authentication, false, this);
    this.router.navigate(['/login']);
  }

  public onSearchChange(value) {
    console.log(1, value);
    this.filter.model = value;
    this.searchByFilter();
  }

  public setCars(data) {
    console.log(data);
    this.cars = data;
  }

  public getCars() {
    this.bus.publish(this.eventService.requested.data.car.all, this);
  }

  public onFileSelected(files: FileList): void {
    this.selectedFile = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.previewFileSrc = reader.result;
    };
    reader.readAsDataURL(files[0]);
  }

  public onCarCreate(form: NgForm) {
    this.car.brand = form.value.brand;
    this.car.model = form.value.model;
    this.car.year = form.value.year;
    this.car.color = form.value.color;
    this.car.driveType = form.value.driveType;
    this.car.transportType = form.value.transportType;
    this.car.mileage = form.value.mileage;
    this.car.doorsAmount = form.value.doorsAmount;
    this.car.engineType = form.value.engineType;
    this.car.passengerAmount = form.value.passengerAmount;
    // this.data.uploadFile(this.selectedFile)
    //   .subscribe((data) => {
    //     this.car.imgId = data;
    //     this.bus.publish(this.eventService.requested.data.car.create, this.car, this);
    //   }, (error) => console.log(error));

    this.modalRef.close('City created');
  }

  private addToFilter(param, value): void {
    let present = false;
    switch (param) {
      case 'brands':
        present = false;
        this.filter.brands.forEach((brand, index) => {
          if (brand === value) {
            present = true;
            this.filter.brands.splice(index, 1);
          }
        });
        if (!present) {
          this.filter.brands.push(value);
        }
        break;
      case 'years':
        present = false;
        this.filter.years.forEach((brand, index) => {
          if (brand === value) {
            present = true;
            this.filter.years.splice(index, 1);
          }
        });
        if (!present) {
          this.filter.years.push(value);
        }
        break;
      case 'colors':
        present = false;
        this.filter.colors.forEach((brand, index) => {
          if (brand === value) {
            present = true;
            this.filter.colors.splice(index, 1);
          }
        });
        if (!present) {
          this.filter.colors.push(value);
        }
        break;
      case 'driveTypes':
        present = false;
        this.filter.driveTypes.forEach((brand, index) => {
          if (brand === value) {
            present = true;
            this.filter.driveTypes.splice(index, 1);
          }
        });
        if (!present) {
          this.filter.driveTypes.push(value);
        }
        break;
      case 'transportTypes':
        present = false;
        this.filter.transportTypes.forEach((brand, index) => {
          if (brand === value) {
            present = true;
            this.filter.transportTypes.splice(index, 1);
          }
        });
        if (!present) {
          this.filter.transportTypes.push(value);
        }
        break;
      case 'engineTypes':
        present = false;
        this.filter.engineTypes.forEach((brand, index) => {
          if (brand === value) {
            present = true;
            this.filter.engineTypes.splice(index, 1);
          }
        });
        if (!present) {
          this.filter.engineTypes.push(value);
        }
        break;
      case 'passengerAmount':
        present = false;
        this.filter.passengerAmount.forEach((brand, index) => {
          if (brand === value) {
            present = true;
            this.filter.passengerAmount.splice(index, 1);
          }
        });
        if (!present) {
          this.filter.passengerAmount.push(value);
        }
        break;
    }

    this.searchByFilter();
    console.log(55, this.filter);
  }

  private searchByFilter() {
    if (this.filter.brands.length == 0 && this.filter.years.length == 0 && this.filter.colors.length == 0 && this.filter.driveTypes.length == 0 && this.filter.engineTypes.length == 0 && this.filter.transportTypes.length == 0 && this.filter.passengerAmount.length == 0 && this.filter.model.length == 0) {
      this.getCars();
    } else {
      this.bus.publish(this.eventService.requested.data.car.filter, this.filter, this);
    }

  }

  public buyCar(id) {
    this.bus.publish(this.eventService.requested.data.car.buy, {
      productId: id,
      userId: JSON.parse(localStorage.getItem('currentUser')).id
    }, this);
  }

  public subscribe(): void {
    this.bus.subscribe(this.eventService.notified.authentication, this.setLoggedIn, this);
    this.bus.subscribe(this.eventService.received.data.car.all, this.setCars, this);
    this.bus.subscribe(this.eventService.received.data.car.filter, this.setCars, this);
    this.bus.subscribe(this.eventService.received.data.car.buy, this.getCars, this);
  }

  public unSubscribe(): void {
    this.bus.unsubscribe(this.eventService.notified.authentication, this.setLoggedIn);
    this.bus.unsubscribe(this.eventService.received.data.car.all, this.setCars);
    this.bus.unsubscribe(this.eventService.received.data.car.filter, this.setCars);
    this.bus.unsubscribe(this.eventService.received.data.car.buy, this.getCars);
  }

  ngOnInit(): void {
    this.subscribe();
    this.getCars();
    if (localStorage.getItem('currentUser')) {
      this.email = JSON.parse(localStorage.getItem('currentUser')).email;
      this.role = JSON.parse(localStorage.getItem('currentUser')).role;
      this.bus.publish(this.eventService.notified.authentication, true, this);
    } else {
      this.bus.publish(this.eventService.notified.authentication, false, this);
    }
  }

  ngOnDestroy(): void {
    this.unSubscribe();
  }

}
