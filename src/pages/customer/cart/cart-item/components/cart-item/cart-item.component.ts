import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../../../../models/cart-item.model';
import { CartsService } from '../../../../../../services/cart/carts.service';
import { Cart } from '../../../../../../models/cart.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() onRemoveItem = new EventEmitter<void>();

  showRemoveConfirmation = false;
  quantityOptions: number[] = [];

  constructor(private cartsService: CartsService) {}

  ngOnInit() {
    this.generateQuantityOptions();
  }

  generateQuantityOptions() {
    this.quantityOptions = Array.from(
      { length: this.item.maxQuantity },
      (_, i) => i + 1
    );
  }

  getAttributesDisplay(): string {
    if (!this.item.attributes) return '';
    return Object.entries(this.item.attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }

  getStockMessage(): string {
    return this.item.quantity >= this.item.maxQuantity
      ? 'Maximum quantity reached'
      : `${this.item.maxQuantity - this.item.quantity} items left`;
  }

  decreaseQuantity() {
    if (this.item.quantity > 1) {
      this.quantityChange.emit(this.item.quantity - 1);
    }
  }

  increaseQuantity() {
    if (this.item.quantity < this.item.maxQuantity) {
      this.quantityChange.emit(this.item.quantity + 1);
    }
  }

  onQuantityChange(event: Event) {
    const value = +(event.target as HTMLSelectElement).value;
    this.quantityChange.emit(value);
  }

  onRemove() {
    this.showRemoveConfirmation = true;
  }

  confirmRemove() {
    this.onRemoveItem.emit();
    this.showRemoveConfirmation = false;
  }

  cancelRemove() {
    this.showRemoveConfirmation = false;
  }

}
