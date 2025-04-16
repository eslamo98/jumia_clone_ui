import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output ,Input} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-step',
  imports: [CommonModule,FormsModule],  
  templateUrl: './payment-step.component.html',
  styleUrls: [ './payment-step.component.css','../checkout/checkout.component.css'],
})
export class PaymentStepComponent {
  selectedPaymentMethod: string = 'credit-card';
  @Input() currentStep: number = 0;
  @Output() paymentMethodSelected = new EventEmitter<string>();

  onPaymentMethodChange() {
    this.paymentMethodSelected.emit(this.selectedPaymentMethod);
  }
  confirmPaymentMethod(){
    // Example confirmation logic
    console.log('Order confirmed!');
    console.log('Payment Method:', this.selectedPaymentMethod);
  }
}
