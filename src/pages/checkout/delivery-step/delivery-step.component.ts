import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delivery-step',
  imports: [CommonModule,FormsModule],
  templateUrl: './delivery-step.component.html',
  styleUrls: ['./delivery-step.component.css']
})
export class DeliveryStepComponent {
  @Input() currentStep: number = 0;
  @Output() deliveryOptionSelected = new EventEmitter<string>();
  deliveryOption = 'Standard Delivery';
  deliveryStartDate = '2025-04-23';
  deliveryEndDate = '2025-04-27';
  isEditingDelivery = false;

  editDeliveryOption() {
    this.isEditingDelivery = !this.isEditingDelivery;
  }
  onDeliveryOptionChange() {
    this.deliveryOptionSelected.emit(this.deliveryOption);
  }
 
  selectedDeliveryOption: string = 'Standard Delivery';

}
