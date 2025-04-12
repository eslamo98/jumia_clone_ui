// shared/header/header.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="jumia-header">
      <div class="header-top">
        <div class="container">
          <div class="logo">
            <a routerLink="/">
              <img src="assets/images/jumia-logo.png" alt="Jumia Logo">
            </a>
          </div>
          
          <div class="search-bar">
            <input type="text" placeholder="Search products, brands and categories...">
            <button class="search-button">
              <i class="search-icon">🔍</i>
            </button>
          </div>
          
          <div class="user-actions">
            <a routerLink="/auth/login" class="action-link">
              <i class="user-icon">👤</i>
              <span>Account</span>
            </a>
            <a routerLink="/help" class="action-link">
              <i class="help-icon">❓</i>
              <span>Help</span>
            </a>
            <a routerLink="/cart" class="action-link cart">
              <i class="cart-icon">🛒</i>
              <span>Cart</span>
              <span class="cart-count">0</span>
            </a>
          </div>
        </div>
      </div>
      
      <nav class="header-nav">
        <div class="container">
          <ul class="nav-list">
            <li *ngFor="let category of categories" class="nav-item">
              <a [routerLink]="['/category', category.slug]" class="nav-link">
                {{ category.name }}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .jumia-header {
      background-color: white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .header-top {
      padding: 15px 0;
      border-bottom: 1px solid #f5f5f5;
    }
    
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
      display: flex;
      align-items: center;
    }
    
    .logo {
      flex: 0 0 150px;
    }
    
    .logo img {
      max-width: 100%;
      height: auto;
    }
    
    .search-bar {
      flex: 1;
      margin: 0 20px;
      position: relative;
    }
    // shared/header/header.component.ts (continued)
    .search-bar input {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .search-button {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      background-color: #f68b1e;
      border: none;
      border-radius: 0 4px 4px 0;
      width: 50px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .search-icon {
      color: white;
      font-size: 18px;
    }
    
    .user-actions {
      display: flex;
      gap: 20px;
    }
    
    .action-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      color: #333;
      font-size: 12px;
    }
    
    .action-link i {
      font-size: 20px;
      margin-bottom: 4px;
    }
    
    .cart {
      position: relative;
    }
    
    .cart-count {
      position: absolute;
      top: -5px;
      right: -8px;
      background-color: #f68b1e;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
    }
    
    .header-nav {
      background-color: #f5f5f5;
      padding: 10px 0;
    }
    
    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      overflow-x: auto;
    }
    
    .nav-item {
      margin-right: 20px;
      white-space: nowrap;
    }
    
    .nav-link {
      text-decoration: none;
      color: #333;
      font-size: 14px;
      font-weight: 500;
      padding: 5px 0;
      transition: color 0.2s;
    }
    
    .nav-link:hover {
      color: #f68b1e;
    }
    
    @media (max-width: 768px) {
      .header-top .container {
        flex-wrap: wrap;
      }
      
      .logo {
        flex: 0 0 100px;
      }
      
      .search-bar {
        flex: 1 0 100%;
        order: 3;
        margin: 15px 0 0;
      }
      
      .user-actions {
        margin-left: auto;
      }
    }
  `]
})
export class HeaderComponent {
  categories = [
    { name: 'Supermarket', slug: 'supermarket' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Phones & Tablets', slug: 'phones-tablets' },
    { name: 'Home & Office', slug: 'home-office' },
    { name: 'Health & Beauty', slug: 'health-beauty' },
    { name: 'Baby Products', slug: 'baby-products' },
    { name: 'Gaming', slug: 'gaming' },
    { name: 'Sporting Goods', slug: 'sporting-goods' }
  ];
}
