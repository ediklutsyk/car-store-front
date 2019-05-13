import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {BusService} from '../bus.service';
import {GetOptions} from '../interfaces/request.interfaces';
import {RequestService} from '../request.service';
import {EventsService} from '../events.service';

interface GetAllCarsResponse {
  cars: any;
}

@Injectable()
export class GetAllCarsService {

  private readonly options: GetOptions<GetAllCarsResponse>;

  constructor(
    private bus: BusService,
    private events: EventsService,
    private requestService: RequestService
  ) {
    this.options = {
      url: '/cars',
      handlers: {
        success: this.success.bind(this),
        error: this.error.bind(this)
      }
    };
    this.subscribe();
  }

  public success(cars: GetAllCarsResponse): void {
    this.bus.publish(this.events.received.data.car.all, cars);
  }

  public error(httpErrorResponse: HttpErrorResponse): void {
    this.bus.publish(this.events.received.error, httpErrorResponse);
  }

  private request(): void {
    this.requestService.get<GetAllCarsResponse>(this.options);
  }

  public subscribe(): void {
    this.bus.subscribe(this.events.requested.data.car.all, this.request, this);
  }
}
