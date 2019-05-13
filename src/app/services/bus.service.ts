import {Injectable} from '@angular/core';
/* tslint:disable */
// import * as Rx from 'rxjs/Rx';
/* tslint:enable */
import {from, Subject} from 'rxjs';

// service for communication between modules, components, services
@Injectable()
export class BusService {

  private listeners: any;
  private eventsSubject: any;
  private events: any;

  constructor() {
    this.listeners = {};
    this.eventsSubject = new Subject();

    this.events = from(this.eventsSubject);
    // subscribe on custom events stream; check the name of event and run funcationality with a specific context
    this.events.subscribe(
      ({name, args}) => {
        if (this.listeners[name]) {
          for (const listener of this.listeners[name]) {
            const myThis = listener.boundContext;
            if (listener.boundContext) {
              listener.call(myThis, ...args);
            } else {
              listener(...args);
            }
          }
        }
      });
  }

  // add new event to stream with a specific context
  public subscribe(name: string, listener: any, context?: any): void {
    if (context) {
      listener.boundContext = context;
    }
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }
    this.listeners[name].push(listener);
  }

  // remove event from stream
  public unsubscribe(name: string, listener: any): void {
    const listeners = this.listeners[name];
    if (listeners) {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    }
  }

  // start event with Subject.prototype.next()
  public publish(name: string, ...args): void {
    this.eventsSubject.next({
      name,
      args
    });
  }
}
