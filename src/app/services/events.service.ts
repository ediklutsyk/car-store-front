import {Injectable} from '@angular/core';

@Injectable()
export class EventsService {
  public notified = {
    loading: 'notified.loading',
    authentication: 'notified.authentication',
  };
  public requested = {
    data: {
      authentication: {
        get: 'requested.data.authentication',
        isAuth: 'requested.data.authentication.is.auth'
      },
      user: {
        create: 'requested.data.user.create',
      },
      car:{
        all: 'requested.data.car.all',
        filter: 'requested.data.car.filter',
        buy: 'requested.data.car.buy',
      }
    }
  };
  public received = {
    data: {
      authentication: {
        get: 'received.data.authentication',
        isAuth: 'received.data.authentication.is.auth'
      },
      user: {
        create: 'received.data.user.create',
      },
      car:{
        all: 'received.data.car.all',
        filter: 'received.data.car.filter',
        buy: 'received.data.car.buy',
      }
    },
    error: 'received.error',
    success: 'received.success'
  };
}
