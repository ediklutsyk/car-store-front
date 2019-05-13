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

    }
  };
  public received = {
    data: {
      authentication: {
        get: 'received.data.authentication',
        isAuth: 'received.data.authentication.is.auth'
      },
    },
    error: 'received.error',
    success: 'received.success'
  };
}
