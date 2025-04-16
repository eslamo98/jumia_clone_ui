import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private checkoutState = new BehaviorSubject<any>({
    address: null,
    delivery: null,
    payment: null
  });
  
  currentState = this.checkoutState.asObservable();

  updateState(state: any) {
    this.checkoutState.next({ 
      ...this.checkoutState.value, 
      ...state 
    });
  }
}