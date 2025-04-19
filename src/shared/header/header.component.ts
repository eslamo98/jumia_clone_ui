// shared/header/header.component.ts
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// header.component.ts
import { Component, HostListener, OnInit } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HeaderComponent implements OnInit {
  isAccountDropdownOpen = false;
  cartItemCount = 0;
  
  constructor() { }

  ngOnInit(): void {
    // Initialize any data needed
  }

  toggleAccountDropdown() {
    this.isAccountDropdownOpen = !this.isAccountDropdownOpen;
  }

  closeAccountDropdown() {
    this.isAccountDropdownOpen = false;
  }
}