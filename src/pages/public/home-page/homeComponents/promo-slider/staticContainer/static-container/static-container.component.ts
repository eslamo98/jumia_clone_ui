import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-static-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './static-container.component.html',
  styleUrls: ['./static-container.component.css']
})
export class StaticContainerComponent implements OnInit {
  // قائمة بالصور التي سيتم عرضها مع إضافة روابط التنقل
  slides = [
    { image: '/images/home/staticContainer/staticContainer1.png', alt: 'Best Price', link: '/best-price' },
    { image: '/images/home/staticContainer/staticContainer2.png', alt: 'Extra Discounts', link: '/discounts' },
    { image: '/images/home/staticContainer/staticContainer3.png', alt: 'Egyptian Brands', link: '/egyptian-brands' },
    { image: '/images/home/staticContainer/staticContainer4.png', alt: 'Jumia Force', link: '/jumia-force' },
    { image: '/images/home/staticContainer/staticContainer5.png', alt: 'Installments', link: '/installments' },
    { image: '/images/home/staticContainer/staticContainer6.png', alt: 'Official Store', link: '/official-store' },
  ];

  @ViewChild('slidesContainer') slidesContainerRef!: ElementRef;

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialization if needed
  }

  // دالة للانتقال إلى صفحة أخرى عند النقر على الصورة
  navigateTo(link: string) {
    this.router.navigate([link]);
  }
}