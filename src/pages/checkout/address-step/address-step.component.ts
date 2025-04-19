import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-address-step',
  imports: [CommonModule,FormsModule],
  templateUrl: './address-step.component.html',
  styleUrls: ['./address-step.component.css']
})
export class AddressStepComponent {
  @Input() currentStep: number = 0;
  @Output() editAddressEvent = new EventEmitter<void>();
  @Output() saveAddressEvent = new EventEmitter<void>();
  nextStep = 2;
  customerName = 'فاطمة محمود';
  customerAddress = 'دمنهور, دمنهور';
  customerCity = 'Al Beheira - Damanhour';
  phoneNumber = '+20 1283530080';
  isEditing = false;
  customerRegion='Al Beheira - Damanhour';
  

  
  editAddress() {
    this.editAddressEvent.emit();
  }

  saveAddress() {
    this.saveAddressEvent.emit();
  }
  goToNextStep() {}
}
