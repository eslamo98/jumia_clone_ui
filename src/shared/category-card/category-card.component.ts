// shared/category-card/category-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category } from '../../models/category';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a [routerLink]="['/category', category.categoryId]" class="category-card">
      <div class="category-image">
        <img [src]="category.imageUrl" [alt]="category.name">
      </div>
      <div class="category-name">{{ category.name }}</div>
      <div class="category-description">{{ category.description }}</div>
      <div class="subcategory-count">{{ category.subcategoryCount }} subcategories</div>
    </a>
  `,
  styles: [`
    .category-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      padding: 15px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      transition: transform 0.3s ease;
    }
    
    .category-card:hover {
      transform: translateY(-5px);
    }
    
    .category-image {
      width: 80px;
      height: 80px;
      margin-bottom: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .category-image img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    
    .category-name {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      text-align: center;
      margin-bottom: 5px;
    }
    
    .category-description {
      font-size: 12px;
      color: #666;
      text-align: center;
      margin-bottom: 8px;
      height: 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .subcategory-count {
      font-size: 11px;
      color: #f68b1e;
      text-align: center;
    }
  `]
})
export class CategoryCardComponent {
  @Input() category!: Category;
}