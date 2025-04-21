// navigation.service.ts 
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  // Store the currently selected category
  private selectedCategorySubject = new BehaviorSubject<any>(null);
  selectedCategory$ = this.selectedCategorySubject.asObservable();
  
  // Store the category name for routing purposes
  private categoryNameSubject = new BehaviorSubject<string>('');
  categoryName$ = this.categoryNameSubject.asObservable();

  // Store the category ID for API calls
  private categoryIdSubject = new BehaviorSubject<string>('');
  categoryId$ = this.categoryIdSubject.asObservable();
  
  // NEW: Store the subcategory ID for API calls
  private subcategoryIdSubject = new BehaviorSubject<string>('');
  subcategoryId$ = this.subcategoryIdSubject.asObservable();
  
  // NEW: Store the selected subcategory
  private selectedSubcategorySubject = new BehaviorSubject<any>(null);
  selectedSubcategory$ = this.selectedSubcategorySubject.asObservable();

  constructor() { }

  // Set the selected category when "See All" is clicked
  setSelectedCategory(category: any): void {
    this.selectedCategorySubject.next(category);
    if (category) {
      if (category.name) {
        this.categoryNameSubject.next(category.name);
      }
      if (category.id) {
        this.categoryIdSubject.next(category.id);
      }
    }
  }
  
  // NEW: Set the selected subcategory
  setSelectedSubcategory(subcategory: any): void {
    this.selectedSubcategorySubject.next(subcategory);
    if (subcategory && subcategory.id) {
      this.subcategoryIdSubject.next(subcategory.id);
    }
  }

  // Set just the category name (when we don't have the full category object)
  setCategoryName(name: string): void {
    this.categoryNameSubject.next(name);
  }

  // Set just the category ID
  setCategoryId(id: string): void {
    this.categoryIdSubject.next(id);
  }
  
  // NEW: Set just the subcategory ID
  setSubcategoryId(id: string): void {
    this.subcategoryIdSubject.next(id);
  }

  // Get the current category name
  getCategoryName(): string {
    return this.categoryNameSubject.getValue();
  }

  // Get the current category ID
  getCategoryId(): string {
    return this.categoryIdSubject.getValue();
  }
  
  // NEW: Get the current subcategory ID
  getSubcategoryId(): string {
    return this.subcategoryIdSubject.getValue();
  }

  // Get the current category object
  getSelectedCategory(): any {
    return this.selectedCategorySubject.getValue();
  }
  
  // NEW: Get the current subcategory object
  getSelectedSubcategory(): any {
    return this.selectedSubcategorySubject.getValue();
  }

  // Clear selection
  clearSelectedCategory(): void {
    this.selectedCategorySubject.next(null);
    this.categoryNameSubject.next('');
    this.categoryIdSubject.next('');
    // Clear subcategory data too when clearing category
    this.clearSelectedSubcategory();
  }
  
  // NEW: Clear subcategory selection
  clearSelectedSubcategory(): void {
    this.selectedSubcategorySubject.next(null);
    this.subcategoryIdSubject.next('');
  }
}