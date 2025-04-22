import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../models/cart-item.model';
import { CartItemComponent } from './cart-item/components/cart-item/cart-item.component';
import { CartSummaryComponent } from './cart-summary/components/cart-summary/cart-summary.component';
import { CartsService } from '../../../services/cart/carts.service';
import { Cart } from '../../../models/cart';
import { CartResponse } from '../../../models/cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, CartItemComponent, CartSummaryComponent],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  showEmptyCartMessage: boolean = false;

  constructor(private cartService: CartsService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (response: any) => {
        console.log('Cart response:', response);
        console.log('Received cart items:', this.cartItems);
        // Simplify the response handling
       // التحقق من صحة الاستجابة
       if (response && response.data && Array.isArray(response.data.cartItems)) {
        this.cartItems = response.data.cartItems;

        // إذا كانت العربة فارغة
        if (this.cartItems.length === 0) {
          this.showEmptyCartMessage = true;
        } else {
          this.showEmptyCartMessage = false;
        }
      } else {
        // إذا لم تكن هناك بيانات صالحة
        this.cartItems = [];
        this.showEmptyCartMessage = true;
      }
      this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.error = 'Failed to load your cart. Please try again.';
        this.isLoading = false;
        this.showEmptyCartMessage = true; // عرض رسالة إذا حدث خطأ
      },
    });
  }

  updateItemQuantity(itemId: number, quantity: number) {
    this.isLoading = true;
    const updateItem: any = { quantity }; // Only send the quantity
    this.cartService.updateCartItem(itemId, updateItem).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err) => {
        console.error('Error updating item quantity:', err);
        this.error = 'Failed to update item quantity. Please try again.';
        this.isLoading = false;
      }
    });
  }

  removeItem(itemId: number) {
    this.isLoading = true;
    this.cartService.removeCartItem(itemId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err) => {
        console.error('Error removing item:', err);
        this.error = 'Failed to remove item from cart. Please try again.';
        this.isLoading = false;
      }
    });
  }

  clearCart() {
    if (this.cartItems.length === 0) return;
    
    this.isLoading = true;
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cartItems = [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error clearing cart:', err);
        this.error = 'Failed to clear your cart. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getCartItemCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  hasJumiaExpressItems(): boolean {
    return this.cartItems.some((item) => item.isJumiaExpress);
  }

  handleQuantityChange(item: CartItem, newQuantity: number): void {
    this.updateItemQuantity(item.cartItemId, newQuantity);
  }

  handleRemoveItem(itemId: number): void {
    this.removeItem(itemId);
  }
}