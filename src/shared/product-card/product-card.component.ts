import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-card">
      <div class="product-image">
        <img [src]="product.image" [alt]="product.name">
        <div *ngIf="product.discount" class="discount-badge">-{{ product.discount }}%</div>
        <div *ngIf="product.freeShipping" class="shipping-badge">Free Shipping</div>
      </div>
      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <div class="product-price">
          <span class="current-price">₦{{ product.price.toLocaleString() }}</span>
          <span *ngIf="product.oldPrice" class="old-price">₦{{ product.oldPrice.toLocaleString() }}</span>
        </div>
        <div class="product-rating">
          <div class="stars">
            <i *ngFor="let star of getStars(product.rating)" class="star" [ngClass]="star"></i>
          </div>
          <span class="rating-value">({{ product.rating }})</span>
        </div>
        <button class="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    
    .product-card:hover {
      transform: translateY(-5px);
    }
    
    .product-image {
      position: relative;
      height: 180px;
      overflow: hidden;
    }
    
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background-color: #f5f5f5;
      padding: 10px;
    }
    
    .discount-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: #f68b1e;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    
    .shipping-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #276076;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
    
    .product-info {
      padding: 15px;
    }
    
    .product-name {
      font-size: 14px;
      margin: 0 0 10px;
      color: #333;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .product-price {
      margin-bottom: 10px;
    }
    
    .current-price {
      font-size: 16px;
      font-weight: 700;
      color: #f68b1e;
    }
    
    .old-price {
      font-size: 14px;
      color: #999;
      text-decoration: line-through;
      margin-left: 8px;
    }
    
    .product-rating {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .stars {
      display: flex;
      margin-right: 5px;
    }
    
    .star {
      color: #f68b1e;
      font-size: 14px;
    }
    
    .star.full:before {
      content: "★";
    }
    
    .star.half:before {
      content: "★";
    }
    
    .star.empty:before {
      content: "☆";
    }
    
    .rating-value {
      font-size: 12px;
      color: #666;
    }
    
    .add-to-cart-btn {
      width: 100%;
      padding: 10px;
      background-color: #f68b1e;
      color: white;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .add-to-cart-btn:hover {
      background-color: #e67e0d;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
  
  getStars(rating: number): string[] {
    const starsArray: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      starsArray.push('full');
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      starsArray.push('half');
    }
    
    // Add empty stars to make a total of 5
    while (starsArray.length < 5) {
      starsArray.push('empty');
    }
    
    return starsArray;
  }
}
