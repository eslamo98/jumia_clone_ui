import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';



@Component({
  selector: 'app-promo-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promo-slider.component.html',
  styleUrls: ['./promo-slider.component.css']
})
export class PromoSliderComponent implements OnInit {
  slides = [
    { image: '/images/homeSlider1/homeSlider1.png', alt: 'Best Price', link: '/best-price' },
    { image: '/images/homeSlider1/homeSlider2.png', alt: 'Extra Discounts', link: '/best-price' },
    { image: '/images/homeSlider1/homeSlider3.png', alt: 'Egyptian Brands', link: '/best-price' },
    { image: '/images/homeSlider1/homeSlider4.png', alt: 'Jumia Force', link: '/best-price' },
    { image: '/images/homeSlider1/homeSlider5.png', alt: 'Installments', link: '/best-price' },
    { image: '/images/homeSlider1/homeSlider6.png', alt: 'Official Store', link: '/best-price' },
    { image: '/images/homeSlider1/homeSlider7.png', alt: 'Gift Vouchers', link: '/best-price' },
    { image: '/images/homeSlider1/homeSlider8.png', alt: 'New on Jumia', link: '/best-price' },
    { image: '/images/homeSlider1/homeSlider9.png', alt: 'New on Jumia', link: '/best-price' },
  ];

  @ViewChild('slidesContainer') slidesContainerRef!: ElementRef;

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialization if needed
  }
  navigateTo(link: string) {
    this.router.navigate([link]);
  }

  prevSlide() {
    const slideWidth = 190; // width + gap
    this.slidesContainerRef.nativeElement.scrollLeft -= slideWidth * 3;
  }

  nextSlide() {
    const slideWidth = 190; // width + gap
    this.slidesContainerRef.nativeElement.scrollLeft += slideWidth * 3;
  }
}