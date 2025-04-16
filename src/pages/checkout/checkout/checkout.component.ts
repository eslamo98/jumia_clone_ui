import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
 import {AddressStepComponent } from '../address-step/address-step.component';
import { DeliveryStepComponent } from '../delivery-step/delivery-step.component';
import { PaymentStepComponent } from '../payment-step/payment-step.component';
 import { OrderSummaryComponent } from '../order-summary/order-summary.component';



@Component({
  selector: 'app-checkout',
  imports: [ AddressStepComponent,DeliveryStepComponent,PaymentStepComponent,OrderSummaryComponent,CommonModule],
  
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  currentStep: number =1;
  
   

  goToStep(step: number) {
    this.currentStep = step;
  }

goToNextStep() {
  if (this.currentStep < 3) {
    this.currentStep++;
  } else {
 
    console.log('Place Order');
  }
}

goToPreviousStep() {
  if (this.currentStep > 1) {
    this.currentStep--;
  }
}
customerAddress: string = '';
phoneNumber: string = '';
deliveryOption: string = 'Standard Delivery';
paymentMethod: string = 'credit-card';

itemsTotal: number = 0;
deliveryFee: number = 0;
total: number = 0;





constructor() {
  this.calculateSummary();
}

setStep(step: number): void {
  this.currentStep = step;
}

confirmOrder(): void {
  // Example confirmation logic
  console.log('Order confirmed!');
  console.log('Address:', this.customerAddress);
  console.log('Phone:', this.phoneNumber);
  console.log('Delivery Option:', this.deliveryOption);
  console.log('Payment Method:', this.paymentMethod);
}

calculateSummary(): void {
  // Dummy values for now
  this.itemsTotal = 500;
  this.deliveryFee = this.deliveryOption === 'Express Delivery' ? 100 : 50;
  this.total = this.itemsTotal + this.deliveryFee;
}
onDeliveryOptionSelected(option: string) {
  console.log('Selected Delivery Option: ', option);}
  onPaymentMethodSelected(method: string) {
    console.log('Selected Payment Method: ', method);}
}
