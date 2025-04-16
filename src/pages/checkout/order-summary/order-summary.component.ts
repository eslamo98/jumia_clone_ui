import { Component } from '@angular/core';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['../checkout/checkout.component.css'],
})
export class OrderSummaryComponent {
  itemsTotal: number = 0.00;
  deliveryFee: number = 0.00;

  get total(): number {
    return this.itemsTotal + this.deliveryFee;
  }

  confirmOrder() {
    // You can emit an event or handle logic here
    console.log('Order confirmed!');
  }
}
