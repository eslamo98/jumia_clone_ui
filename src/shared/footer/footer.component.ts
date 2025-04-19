// shared/footer/footer.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="jumia-footer">
      <div class="footer-top">
        <div class="container">
          <div class="footer-columns">
            <div class="footer-column">
              <h4>NEED HELP?</h4>
              <ul>
                <li><a routerLink="/help/chat">Live Chat</a></li>
                <li><a routerLink="/help/contact">Contact Us</a></li>
                <li><a routerLink="/help/faq">Help Center</a></li>
                <li><a routerLink="/help/delivery">How to Shop</a></li>
                <li><a routerLink="/help/delivery">Delivery options</a></li>
                <li><a routerLink="/help/returns">Return Policy</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4>ABOUT JUMIA</h4>
              <ul>
                <li><a routerLink="/about">About Us</a></li>
                <li><a routerLink="/careers">Careers</a></li>
                <li><a routerLink="/terms">Terms and Conditions</a></li>
                <li><a routerLink="/privacy">Privacy Policy</a></li>
                <li><a routerLink="/blog">Blog</a></li>
                <li><a routerLink="/flash-sales">Flash Sales</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4>MAKE MONEY ON JUMIA</h4>
              <ul>
                <li><a routerLink="/sell-on-jumia">Sell on Jumia</a></li>
                <li><a routerLink="/vendor-hub">Vendor Hub</a></li>
                <li><a routerLink="/become-affiliate">Become an Affiliate</a></li>
                <li><a routerLink="/jumia-logistics">Jumia Logistics</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4>JUMIA INTERNATIONAL</h4>
              <div class="country-flags">
                <a href="#" class="flag">🇳🇬</a>
                <a href="#" class="flag">🇰🇪</a>
                <a href="#" class="flag">🇪🇬</a>
                <a href="#" class="flag">🇨🇮</a>
                <a href="#" class="flag">🇲🇦</a>
                <a href="#" class="flag">🇸🇳</a>
              </div>
              
              <h4 class="social-heading">JOIN US ON</h4>
              <div class="social-icons">
                <a href="#" class="social-icon">📱</a>
                <a href="#" class="social-icon">📘</a>
                <a href="#" class="social-icon">🐦</a>
                <a href="#" class="social-icon">📸</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="container">
          <div class="payment-methods">
            <h4>PAYMENT METHODS</h4>
            <div class="method-icons">
              <span class="method-icon">💳</span>
              <span class="method-icon">🏦</span>
              <span class="method-icon">💰</span>
            </div>
          </div>
          
          <div class="copyright">
            © {{ currentYear }} Jumia Clone. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .jumia-footer {
      background-color: #282828;
      color: #fff;
      padding-top: 40px;
    }
    
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
    }
    
    .footer-columns {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
    }
    
    .footer-column h4 {
      color: #f68b1e;
      font-size: 14px;
      margin-bottom: 15px;
      font-weight: 600;
    }
    
    .footer-column ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-column ul li {
      margin-bottom: 10px;
    }
    
    .footer-column ul li a {
      color: #ccc;
      text-decoration: none;
      font-size: 13px;
      transition: color 0.2s;
    }
    
    .footer-column ul li a:hover {
      color: #f68b1e;
    }
    
    .country-flags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .flag {
      font-size: 20px;
      text-decoration: none;
    }
    
    .social-heading {
      margin-top: 20px;
    }
    
    .social-icons {
      display: flex;
      gap: 15px;
      margin-top: 10px;
    }
    
    .social-icon {
      font-size: 18px;
      text-decoration: none;
    }
    
    .footer-bottom {
      background-color: #1f1f1f;
      padding: 20px 0;
    }
    
    .payment-methods {
      margin-bottom: 20px;
    }
    
    .method-icons {
      display: flex;
      gap: 15px;
      margin-top: 10px;
    }
    
    .method-icon {
      font-size: 24px;
    }
    
    .copyright {
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    
    @media (max-width: 768px) {
      .footer-columns {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    @media (max-width: 480px) {
      .footer-columns {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}