import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {BusService} from '../bus.service';
import {PostOptions} from '../interfaces/request.interfaces';
import {RequestService} from '../request.service';
import {EventsService} from '../events.service'
import {Car} from "../../interfaces/car";

interface SearchRequest {
  filter: any;
}

interface SearchResponse {
  cars: Car[];
}


@Injectable()
export class CarsSearchService {

  private options: PostOptions<SearchRequest, SearchResponse>;

  constructor(
    private bus: BusService,
    private events: EventsService,
    private requestService: RequestService
  ) {
    this.options = {
      url: 'cars/filter',
      body: {
        filter: {},
      },
      handlers: {
        success: this.success.bind(this),
        error: this.error.bind(this)
      }
    };
    this.subscribe();
  }

  public async success(cars) {
    this.bus.publish(this.events.received.data.car.filter, cars, this);
  }

  public error(httpErrorResponse: HttpErrorResponse): void {
    this.bus.publish(this.events.received.error, httpErrorResponse);
  }

  private request(data): void {
    Object.keys(data).forEach(key => {
      this.options.body[key] = data[key];
    });
    this.requestService.post<SearchRequest, SearchResponse>(this.options);
  }

  public subscribe(): void {
    this.bus.subscribe(this.events.requested.data.car.filter, this.request, this);
  }
}
