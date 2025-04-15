import { Component,Input } from '@angular/core';
import { Product } from '../../models/product';
import{ ProductService } from '../../services/Product/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  imports: [CommonModule ,RouterModule],

})
export class ProductCardComponent {
   @Input() product!: Product;
   
  // @Input() showDetailsButton: boolean = true; // to control the visibility of the details button
  // @Input() showAddToCartButton: boolean = true; // to control the visibility of the add to cart button
}

