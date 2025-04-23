import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../../../../models/cart-item.model';
import { CartsService } from '../../../../../../services/cart/carts.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class CartItemComponent implements OnInit {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() onRemoveItem = new EventEmitter<void>();

  showRemoveConfirmation = false;
  quantityOptions: number[] = [];
  isUpdating = false;
  updateError = '';

  constructor(private cartsService: CartsService) {}

  ngOnInit() {
    this.generateQuantityOptions();
  }

  generateQuantityOptions() {
    const maxQty = this.item.maxQuantity || 10; // Default to 10 if not specified
    this.quantityOptions = Array.from(
      { length: maxQty },
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
    const maxQty = this.item.maxQuantity || 10; // Default to 10 if not specified
    return this.item.quantity >= maxQty
      ? 'Maximum quantity reached'
      : `${maxQty - this.item.quantity} items left`;
  }
  
  decreaseQuantity() {
    if (this.item.quantity > 1) {
      console.log('Decreasing quantity to:', this.item.quantity - 1);
      this.quantityChange.emit(this.item.quantity - 1);
    }
  }

  increaseQuantity() {
    const maxQty = this.item.maxQuantity || 10;
    if (this.item.quantity < maxQty) {
      console.log('Increasing quantity to:', this.item.quantity + 1);
      this.quantityChange.emit(this.item.quantity + 1);
    }
  }

  // onQuantityChange(event: Event) {
  //   const value = +(event.target as HTMLSelectElement).value;
  //   this.quantityChange.emit(value);
  // }

  onQuantityChange(event: Event) {
    const value = +(event.target as HTMLSelectElement).value;
    this.updateQuantity(value);
  }

  updateQuantity(newQuantity: number) {
    if (this.isUpdating) return;
    
    this.isUpdating = true;
    this.updateError = '';
    
    // First emit to parent to update UI immediately for better UX
    this.quantityChange.emit(newQuantity);
    
    // Then make the API call
    this.cartsService.updateCartItem(this.item.cartItemId, newQuantity)
      .subscribe({
        next: (response) => {
          this.isUpdating = false;
          console.log('Item updated successfully:', response);
        },
        error: (error) => {
          this.isUpdating = false;
          this.updateError = 'Failed to update item';
          console.error('Error updating item:', error);
          // You might want to emit a notification to the parent about the error
        }
      });
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