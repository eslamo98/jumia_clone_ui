import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.css'], })
export class CartSummaryComponent {
  qualifiesForFreeShipping(): boolean {
    return this.totalPrice >= 250; // Assuming free shipping threshold is 250
  }
  @Input() totalPrice: number = 0;
  @Input() hasExpressItems: boolean = false;
  @Input() itemCount: number = 0;
}