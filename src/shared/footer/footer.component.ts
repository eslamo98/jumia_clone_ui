// src/app/shared/components/footer/footer.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <footer class="bg-dark text-light pt-5 pb-3">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-4">
            <h5 class="text-orange mb-3">About Us</h5>
            <p>Jumia Clone - A demo e-commerce application showcasing a modern online shopping experience.</p>
            <div class="mt-3">
              <a href="#" class="me-2 text-light"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="me-2 text-light"><i class="fab fa-twitter"></i></a>
              <a href="#" class="me-2 text-light"><i class="fab fa-instagram"></i></a>
              <a href="#" class="text-light"><i class="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          <div class="col-md-4 mb-4">
            <h5 class="text-orange mb-3">Quick Links</h5>
            <ul class="list-unstyled">
              <li class="mb-2"><a class="text-light text-decoration-none" routerLink="/"><i class="fas fa-chevron-right me-1"></i> Home</a></li>
              <li class="mb-2"><a class="text-light text-decoration-none" routerLink="/products"><i class="fas fa-chevron-right me-1"></i> Products</a></li>
              <li class="mb-2"><a class="text-light text-decoration-none" routerLink="/auth/register-seller"><i class="fas fa-chevron-right me-1"></i> Sell on Jumia Clone</a></li>
              <li class="mb-2"><a class="text-light text-decoration-none" href="#"><i class="fas fa-chevron-right me-1"></i> Terms & Conditions</a></li>
              <li class="mb-2"><a class="text-light text-decoration-none" href="#"><i class="fas fa-chevron-right me-1"></i> Privacy Policy</a></li>
            </ul>
          </div>
          
          <div class="col-md-4 mb-4">
            <h5 class="text-orange mb-3">Contact</h5>
            <p class="mb-2"><i class="fas fa-map-marker-alt me-2"></i> 123 E-Commerce St, Digital City</p>
            <p class="mb-2"><i class="fas fa-envelope me-2"></i> support&#64;jumiaclone.com</p>
            <p class="mb-2"><i class="fas fa-phone me-2"></i> +123 456 7890</p>
            <p class="mb-2"><i class="fas fa-clock me-2"></i> Mon-Fri: 9AM - 5PM</p>
          </div>
        </div>
        
        <hr class="mt-4 mb-4 border-secondary">
        
        <div class="row">
          <div class="col-md-6 mb-3 mb-md-0">
            <p class="mb-0">&copy; 2025 Jumia Clone. All rights reserved.</p>
          </div>
          <div class="col-md-6 text-md-end">
          <img src="assets/images/payment-methods.png" alt="Payment Methods" height="30">
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .text-orange {
      color: #f68b1e;
    }
    
    footer a:hover {
      color: #f68b1e !important;
      text-decoration: underline !important;
    }
  `]
})
export class FooterComponent {}