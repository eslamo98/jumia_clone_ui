import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../../models/admin';
import { CartItem } from '../../models/cart-item.model';
import { AddCartItem } from '../../models/add-cart-item.model';
import { CartSummary } from '../../models/cart-summary.model';
import { Cart } from '../../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartsService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }
  
  addItemToCart(productId: number, quantity: number): Observable<any> {
    const request = {
      productId,
      quantity
    };
    
    return this.http.post<any>(`${this.apiUrl}/api/Carts/items`, request)
      .pipe(
        tap(response => {
          if (response.success) {
            console.log('Item added successfully:', response.data);
          }
        }),
        catchError(error => {
          console.error('Error adding item to cart:', error);
          throw error; // Re-throw the error so subscribers can handle it
        })
      );
  }

  private mockCartItems: CartItem[] = [
    {
      cartItemId: 1,
      cartId: 1,
      productId: 101,
      name: 'Samsung Galaxy S23',
      productName: 'Samsung Galaxy S23',
      imageUrl: 'https://via.placeholder.com/150',
      productImage: 'https://via.placeholder.com/150',
      priceAtAddition: 999.99,
      originalPrice: 1099.99,
      discountedPrice: 999.99,
      percentOff: 9,
      quantity: 1,
      maxQuantity: 5,
      totalPrice: 999.99,
      variantName: 'Black, 256GB',
      isJumiaExpress: true,
      attributes: {
        Color: 'Black',
        Storage: '256GB',
      },
    },
    {
      cartItemId: 2,
      cartId: 1,
      productId: 102,
      name: 'Nike Air Max 270',
      productName: 'Nike Air Max 270',
      imageUrl: 'https://via.placeholder.com/150',
      productImage: 'https://via.placeholder.com/150',
      priceAtAddition: 149.99,
      originalPrice: 199.99,
      discountedPrice: 149.99,
      percentOff: 25,
      quantity: 2,
      maxQuantity: 3,
      totalPrice: 299.98,
      variantName: 'White/Black, Size 42',
      isJumiaExpress: true,
      attributes: {
        Color: 'White/Black',
        Size: '42',
      },
    },
    {
      cartItemId: 3,
      cartId: 1,
      productId: 103,
      name: 'Apple AirPods Pro',
      productName: 'Apple AirPods Pro',
      imageUrl: 'https://via.placeholder.com/150',
      productImage: 'https://via.placeholder.com/150',
      priceAtAddition: 249.99,
      originalPrice: 279.99,
      discountedPrice: 249.99,
      percentOff: 11,
      quantity: 1,
      maxQuantity: 4,
      totalPrice: 249.99,
      variantName: '2nd Generation',
      isJumiaExpress: true,
      attributes: {
        Generation: '2nd',
        Color: 'White',
      },
    },
    {
      cartItemId: 4,
      cartId: 1,
      productId: 104,
      name: 'Dell XPS 13 Laptop',
      productName: 'Dell XPS 13 Laptop',
      imageUrl: 'https://via.placeholder.com/150',
      productImage: 'https://via.placeholder.com/150',
      priceAtAddition: 1299.99,
      originalPrice: 1499.99,
      discountedPrice: 1299.99,
      percentOff: 13,
      quantity: 1,
      maxQuantity: 2,
      totalPrice: 1299.99,
      variantName: 'Silver, 16GB RAM, 512GB SSD',
      isJumiaExpress: true,
      attributes: {
        Color: 'Silver',
        RAM: '16GB',
        Storage: '512GB SSD',
        Processor: 'Intel i7',
      },
    },
    {
      cartItemId: 5,
      cartId: 1,
      productId: 105,
      name: 'PlayStation 5 Console',
      productName: 'PlayStation 5 Console',
      imageUrl: 'https://via.placeholder.com/150',
      productImage: 'https://via.placeholder.com/150',
      priceAtAddition: 499.99,
      originalPrice: 549.99,
      discountedPrice: 499.99,
      percentOff: 9,
      quantity: 1,
      maxQuantity: 1,
      totalPrice: 499.99,
      variantName: 'Digital Edition',
      isJumiaExpress: true,
      attributes: {
        Edition: 'Digital',
        Storage: '825GB',
      },
    },
  ];

  private mockCart: Cart = {
    cartId: 1,
    customerId: 1,
    cartItems: this.mockCartItems,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  private mockCartSummary: CartSummary = {
    cartId: 1,
    itemsCount: this.mockCartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    ),
    subTotal: this.mockCartItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    ),
    lastUpdated: new Date(),
  };



  // Get full cart with items
  getCart(): Observable<ApiResponse<Cart>> {
    const response: ApiResponse<Cart> = {
      message: 'Cart retrieved successfully',
      data: { ...this.mockCart },
      success: true,
    };
    // Add a delay to simulate network request
    return of(response).pipe(delay(500));
  }

  // Get cart summary
  getCartSummary(): Observable<ApiResponse<CartSummary>> {
    const response: ApiResponse<CartSummary> = {
      message: 'Cart summary retrieved successfully',
      data: { ...this.mockCartSummary },
      success: true,
    };
    return of(response).pipe(delay(300));
  }

  // Get specific cart item
  getCartItem(id: number): Observable<ApiResponse<CartItem>> {
    const item = this.mockCartItems.find((item) => item.cartItemId === id);

    if (item) {
      const response: ApiResponse<CartItem> = {
        message: 'Cart item retrieved successfully',
        data: { ...item },
        success: true,
      };
      return of(response).pipe(delay(200));
    } else {
      const response: ApiResponse<CartItem> = {
        message: 'Cart item not found',
        data: null as any,
        success: false,
      };
      return of(response).pipe(delay(200));
    }
  }

  // Add item to cart
  addCartItem(item: AddCartItem): Observable<ApiResponse<CartItem>> {
    // Create a new cart item with all required properties
    const newCartItem: CartItem = {
      cartItemId: this.getNextId(),
      cartId: this.mockCart.cartId,
      productId: item.productId,
      name: `Product ${item.productId}`,
      productName: `Product ${item.productId}`,
      imageUrl: 'https://via.placeholder.com/150',
      productImage: 'https://via.placeholder.com/150',
      priceAtAddition: item.priceAtAddition || 99.99,
      originalPrice: item.priceAtAddition || 99.99,
      discountedPrice: item.priceAtAddition || 99.99,
      percentOff: 0,
      quantity: item.quantity,
      maxQuantity: 10,
      totalPrice: (item.priceAtAddition || 99.99) * item.quantity,
      variantId: item.variantId,
      variantName: item.variantId ? `Variant ${item.variantId}` : undefined,
      isJumiaExpress: false,
      attributes: {},
    };

    // Add to mock data
    this.mockCartItems.push(newCartItem);
    this.updateCartSummary();

    const response: ApiResponse<CartItem> = {
      message: 'Item added to cart successfully',
      data: { ...newCartItem },
      success: true,
    };
    return of(response).pipe(delay(300));
  }

  // Update cart item quantity
  updateCartItem(
    id: number,
    updateItem: any
  ): Observable<ApiResponse<CartItem>> {
    const index = this.mockCartItems.findIndex(
      (item) => item.cartItemId === id
    );

    if (index !== -1) {
      // Update quantity and total price
      this.mockCartItems[index].quantity = updateItem.quantity;
      this.mockCartItems[index].totalPrice =
        this.mockCartItems[index].priceAtAddition * updateItem.quantity;

      this.updateCartSummary();

      const response: ApiResponse<CartItem> = {
        message: 'Cart item updated successfully',
        data: { ...this.mockCartItems[index] },
        success: true,
      };
      return of(response).pipe(delay(300));
    } else {
      const response: ApiResponse<CartItem> = {
        message: 'Cart item not found',
        data: null as any,
        success: false,
      };
      return of(response).pipe(delay(300));
    }
  }

  // Remove item from cart
  removeCartItem(id: number): Observable<ApiResponse<any>> {
    const index = this.mockCartItems.findIndex(
      (item) => item.cartItemId === id
    );

    if (index !== -1) {
      // Remove the item
      this.mockCartItems.splice(index, 1);
      this.updateCartSummary();

      const response: ApiResponse<any> = {
        message: 'Cart item removed successfully',
        data: null,
        success: true,
      };
      return of(response).pipe(delay(200));
    } else {
      const response: ApiResponse<any> = {
        message: 'Cart item not found',
        data: null,
        success: false,
      };
      return of(response).pipe(delay(200));
    }
  }

  // Clear entire cart
  clearCart(): Observable<ApiResponse<any>> {
    // Clear all items
    this.mockCartItems = [];
    this.updateCartSummary();

    const response: ApiResponse<any> = {
      message: 'Cart cleared successfully',
      data: null,
      success: true,
    };
    return of(response).pipe(delay(400));
  }

  // Helper methods
  private getNextId(): number {
    return this.mockCartItems.length > 0
      ? Math.max(...this.mockCartItems.map((item) => item.cartItemId)) + 1
      : 1;
  }

  private updateCartSummary(): void {
    // Update mock cart
    this.mockCart = {
      ...this.mockCart,
      cartItems: [...this.mockCartItems],
      updatedAt: new Date(),
    };

    // Update mock cart summary
    this.mockCartSummary = {
      cartId: this.mockCart.cartId,
      itemsCount: this.mockCartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
      subTotal: this.mockCartItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      ),
      lastUpdated: new Date(),
    };
  }
}
