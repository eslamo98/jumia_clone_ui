import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CheckoutService } from '../../../services/CheckoutService/CheckoutService';
import { NotificationService } from '../../../services/shared/notification.service';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-summary.component.html',
  styleUrls: ['../checkout/checkout.component.css']
})
export class OrderSummaryComponent {
  @Input() itemsTotal: number = 0.00;
  @Input() deliveryFee: number = 0.00;
  @Input() selectedDeliveryOption: string = '';
  @Input() addressId: number = 0;
  @Input() paymentMethod: string = '';
  @Output() orderConfirmed = new EventEmitter<void>();

  constructor(
    private ordersService: CheckoutService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  get total(): number {
    return this.itemsTotal + this.deliveryFee;
  }

  confirmOrder() {
    if (!this.addressId) {
      this.notificationService.showError('Please select a delivery address');
      return;
    }

    if (!this.selectedDeliveryOption) {
      this.notificationService.showError('Please select a delivery option');
      return;
    }

    if (!this.paymentMethod) {
      this.notificationService.showError('Please select a payment method');
      return;
    }

    this.ordersService.completeOrder(this.addressId, undefined, this.paymentMethod)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.showSuccess('Order placed successfully!');
            this.orderConfirmed.emit();
            this.router.navigate(['/order-confirmation']);
          } else {
            this.notificationService.showError(response.message || 'Failed to place order');
          }
        },
        error: (error) => {
          console.error('Error placing order:', error);
          this.notificationService.showError(error.message || 'Failed to place order');
        }
      });
  }
}