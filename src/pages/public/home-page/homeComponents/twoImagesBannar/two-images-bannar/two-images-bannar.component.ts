import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-two-images-bannar',
  imports: [CommonModule],
  templateUrl: './two-images-bannar.component.html',
  styleUrl: './two-images-bannar.component.css',
  standalone: true
})
export class TwoImagesBannarComponent {
  bannerItems = [
    {
      imgSrc: '/images/home/twoImagesBannar/1.PNG',
      link: '/category/shoes'
    },
    {
      imgSrc: '/images/home/twoImagesBannar/2.PNG',
      link: '/category/makeup'
    }
  ];

  navigateTo(link: string): void {
    // You can implement navigation here
    console.log('Navigating to:', link);
  }
}