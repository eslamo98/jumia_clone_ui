import { Component } from "@angular/core";
import { AuthService } from "../../../services/auth/auth.service";

@Component({
  selector: 'app-cart',
  standalone: true,
  template: `
    <div class="container">
      <h1>Shopping Cart</h1>
      <p>This page is only accessible to authenticated customers.</p>
      <p>Your user ID is: {{ authService.currentUserValue?.userId }}</p>
    </div>
  `
})
export class CartComponent {
  constructor(public authService: AuthService) {}
}