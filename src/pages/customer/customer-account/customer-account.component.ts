import { Component } from "@angular/core";
import { AuthService } from "../../../services/auth/auth.service";

@Component({
  selector: 'app-customer-account',
  standalone: true,
  template: `
    <div class="container">
      <h1>My Account</h1>
      <p>Welcome, {{ authService.currentUserValue?.firstName }}!</p>
      <p>This page is only accessible to authenticated customers.</p>
      <p>Your user type is: {{ authService.currentUserValue?.userType }}</p>
    </div>
  `
})
export class CustomerAccountComponent {
  constructor(public authService: AuthService) {}
}