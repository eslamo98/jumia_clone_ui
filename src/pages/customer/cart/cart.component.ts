import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../models/cart-item.model';
import { CartItemComponent } from './cart-item/components/cart-item/cart-item.component';
import { CartSummaryComponent } from './cart-summary/components/cart-summary/cart-summary.component';
import { CartsService } from '../../../services/cart/carts.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, CartItemComponent, CartSummaryComponent],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartsService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe((response) => {
      if (response.success) {
        this.cartItems = response.data.cartItems;
      }
    });
  }

  updateItemQuantity(itemId: number, quantity: number) {
    const updateItem: any = { cartItemId: itemId, quantity };
    this.cartService
      .updateCartItem(itemId, updateItem)
      .subscribe(() => this.loadCart());
  }

  removeItem(itemId: number) {
    this.cartService.removeCartItem(itemId).subscribe(() => this.loadCart());
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
}
