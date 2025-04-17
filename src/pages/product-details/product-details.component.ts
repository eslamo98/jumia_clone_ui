import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/Product/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  isLoading = true;
  errorMessage = '';
  
 product!: Product;
selectedImage: string = '';
  constructor(private route: ActivatedRoute, private productService: ProductService) {

  }

  quantity: number = 1;
  activeTab: string = 'details';
  isFollowing: boolean = false;
  selectedLocation: number = 1;
  freeDeliveryThreshold: number = 500;
  
  deliveryLocations = [
    { id: 1, name: 'Al Beheira' },
    { id: 2, name: 'Damanhour' }
  ];

  deliveryOptions = [
    { type: 'Pickup Station', fee: 10, leadDays: 2 },
    { type: 'Door Delivery', fee: 30, leadDays: 2 }
  ];
  returnPolicy: string= '30 days return policy';
  defectReportDays: number= 7;
  specifications = [
    { name: 'Color', value: 'Black' },
    { name: 'Size', value: 'Medium' },
    { name: 'Material', value: 'Polyester' },
    { name: 'Weight', value: '500g' }
  ];
  reviews=[ 
    { reviewer: 'Alice', rating: 5, comment: 'Great product!' },
    { reviewer: 'Bob', rating: 4, comment: 'Good quality, but a bit expensive.' },
    { reviewer: 'Charlie', rating: 3, comment: 'Average experience.' },
    { reviewer: 'David', rating: 2, comment: 'Not what I expected.' },
    { reviewer: 'Eve', rating: 1, comment: 'Very disappointed.' }
  ];

  length: number= 30;
    sellername: string= 'John Doe';
    score: number= 4.5;
    followers: number= 100;
    shippingSpeed: string= 'Fast';
    qualityScore: string= 'High';
    rating: string= '4.5/5';

   

      ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        
        if (isNaN(id)) {
          this.errorMessage = 'Invalid product ID';
          this.isLoading = false;
          return;
        }
    
        this.productService.getProductById(id, true).subscribe({
          next: (res) => {
            this.product = res;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('API Error:', err);
            this.isLoading = false;
            this.errorMessage = err.status === 0 
              ? 'Cannot connect to server' 
              : 'Failed to load product details';
          }
        });
      }
    
   
  
  
  selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }
  
  getDeliveryDates(leadDays: number): string {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + leadDays);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  }

  toggleFollow(): void {
    // this.isFollowing = !this.isFollowing;
    // if (this.isFollowing) {
    //   this.product.seller.followers++;
    // } else {
    //   this.product.seller.followers--;
    // }
  }

  setActiveTab(tab: string): void {
    // this.activeTab = tab;
  }

  addToCart(): void {
    // if (this.product.StockQuantity >= this.StockQuantity) {
    //   // Add to cart logic
    //   console.log(`Added ${this.quantity} items to cart`);}
    }
  
}
