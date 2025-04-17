// flash-sales-banner.component.ts
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';


interface Product {
  productId: number;
  name: string;
  basePrice: number;
  finalPrice: number;
  discountPercentage: number;
  mainImageUrl: string;
  stockQuantity: number;
}

@Component({
  selector: 'app-flash-sales-bannar',
  imports: [CommonModule],
  templateUrl: './flash-sales-bannar.component.html',
  styleUrls: ['./flash-sales-bannar.component.css'],
  standalone: true
})
export class FlashSalesBannerComponent implements OnInit, AfterViewInit {
  @ViewChild('productContainer') productContainer!: ElementRef;
  
  products: Product[] = [];
  hours: number = 12;
  minutes: number = 47;
  seconds: number = 33;
  timeLeft: string = '';
  showLeftArrow: boolean = false;
  showRightArrow: boolean = true;
  scrollAmount: number = 250;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Sample data - replace with actual API call
    this.loadProducts();
    
    // Initialize countdown timer
    this.startCountdown();
  }
  
  ngAfterViewInit(): void {
    // Check if we need to show scroll arrows
    this.checkScrollArrows();
  }
  
  loadProducts(): void {
    // Placeholder - replace with actual HTTP request
    this.products = [
      {
        productId: 41,
        name: "Samsung 52-inch B2 Series",
        basePrice: 95.00,
        finalPrice: 59.00,
        discountPercentage: 38,
        mainImageUrl: "/images/home/slider1.png",
        stockQuantity: 233
      },
      {
        productId: 42,
        name: "L'Oreal Paris Elvive Hyaluronic",
        basePrice: 109.00,
        finalPrice: 59.00,
        discountPercentage: 46,
        mainImageUrl: "assets/images/products/loreal-elvive.jpg",
        stockQuantity: 67
      },
      {
        productId: 43,
        name: "Maybelline Colossal Kajal",
        basePrice: 220.00,
        finalPrice: 135.00,
        discountPercentage: 39,
        mainImageUrl: "assets/images/products/maybelline-kajal.jpg",
        stockQuantity: 31
      },
      {
        productId: 44,
        name: "Garnier SkinActive Tissue Mask",
        basePrice: 105.00,
        finalPrice: 39.00,
        discountPercentage: 63,
        mainImageUrl: "assets/images/products/garnier-tissue-mask.jpg",
        stockQuantity: 7
      },
      {
        productId: 45,
        name: "Maybelline Tattoo Brow 36H",
        basePrice: 395.00,
        finalPrice: 285.50,
        discountPercentage: 28,
        mainImageUrl: "assets/images/products/maybelline-tattoo-brow.jpg",
        stockQuantity: 9
      },
      {
        productId: 46,
        name: "Maybelline New York Lipstick",
        basePrice: 685.00,
        finalPrice: 428.00,
        discountPercentage: 38,
        mainImageUrl: "assets/images/products/maybelline-lipstick.jpg",
        stockQuantity: 4
      }
    ];
  }
  
  startCountdown(): void {
    interval(1000).pipe(
      map(() => {
        if (this.seconds > 0) {
          this.seconds -= 1;
        } else {
          this.seconds = 59;
          if (this.minutes > 0) {
            this.minutes -= 1;
          } else {
            this.minutes = 59;
            if (this.hours > 0) {
              this.hours -= 1;
            } else {
              // Timer complete
              this.hours = 0;
              this.minutes = 0;
              this.seconds = 0;
            }
          }
        }
        
        this.timeLeft = `${this.hours}h : ${this.minutes}m : ${this.seconds}s`;
      })
    ).subscribe();
  }
  
  scrollLeft(): void {
    this.productContainer.nativeElement.scrollLeft -= this.scrollAmount;
    setTimeout(() => this.checkScrollArrows(), 100);
  }
  
  scrollRight(): void {
    this.productContainer.nativeElement.scrollLeft += this.scrollAmount;
    setTimeout(() => this.checkScrollArrows(), 100);
  }
  
  checkScrollArrows(): void {
    const container = this.productContainer.nativeElement;
    this.showLeftArrow = container.scrollLeft > 0;
    this.showRightArrow = container.scrollWidth > container.clientWidth + container.scrollLeft;
  }
  
  navigateToProductDetails(productId: number): void {
    this.router.navigate(['/product', productId]);
  }
  
  calculateProgressBarWidth(available: number, total: number = 250): string {
    const percentage = (available / total) * 100;
    return `${percentage}%`;
  }
}