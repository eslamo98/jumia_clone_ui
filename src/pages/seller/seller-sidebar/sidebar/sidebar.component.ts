import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  // isCollapsed = signal<boolean>(false);
  // activeSection = signal<string>('');
  // activeSubSection = signal<string>('');
  // isProductsOpen = signal<boolean>(false);
  @Output() toggle = new EventEmitter<void>();
  @Input() collapsed = false;
  
  

  showProducts = false;
  activeSection = 'products';
  activeSubSection = 'all-products';

  toggleProducts() {
    this.showProducts = !this.showProducts;
  }

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  setActiveSubSection(subSection: string) {
    this.activeSubSection = subSection;
  }


  // toggleProducts() {
  //   this.isProductsOpen.update((v) => !v);
  //   this.setActiveSection('products');
  // }

  // setActiveSection(section: string) {
  //   this.activeSection.set(section);
  //   if (section !== 'products') {
  //     this.isProductsOpen.set(false);
  //   }
  

  // setActiveSubSection(subSection: string) {
  //   this.activeSubSection.set(subSection);
  //   event?.stopPropagation();
  // }


  toggleSidebar() {
    this.collapsed = !this.collapsed;
    this.toggle.emit();
  }

  isSidebarExpanded = signal(true);


}

