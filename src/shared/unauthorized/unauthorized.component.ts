import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container text-center">
      <h1>Access Denied</h1>
      <p>You don't have permission to access this page.</p>
      <button class="btn btn-primary" routerLink="/">Return to Home</button>
    </div>
  `
})
export class UnauthorizedComponent {}