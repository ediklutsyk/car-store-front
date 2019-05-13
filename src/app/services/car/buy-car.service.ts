import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {BusService} from '../bus.service';
import {PostOptions} from '../interfaces/request.interfaces';
import {RequestService} from '../request.service';
import {EventsService} from '../events.service'

interface BuyRequest {
  productId: number,
  userId: number
}

interface BuyResponse {
  message: string;
}


@Injectable()
export class BuyCarService {

  private options: PostOptions<BuyRequest, BuyResponse>;

  constructor(
    private bus: BusService,
    private events: EventsService,
    private requestService: RequestService
  ) {
    this.options = {
      url: 'buy/car',
      body: {
        productId: 0,
        userId: 0
      },
      handlers: {
        success: this.success.bind(this),
        error: this.error.bind(this)
      }
    };
    this.subscribe();
  }

  public async success(message) {
    this.bus.publish(this.events.received.data.car.buy, message, this);
  }

  public error(httpErrorResponse: HttpErrorResponse): void {
    this.bus.publish(this.events.received.error, httpErrorResponse);
  }

  private request(data): void {
    Object.keys(data).forEach(key => {
      this.options.body[key] = data[key];
    });
    this.requestService.post<BuyRequest, BuyResponse>(this.options);
  }

  public subscribe(): void {
    this.bus.subscribe(this.events.requested.data.car.buy, this.request, this);
  }
}
