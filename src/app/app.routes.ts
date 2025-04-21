import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';
import { HomeComponent } from '../pages/public/home-page/home-page.component';
import { ProductsComponent } from '../pages/public/products/products.component';
import { UnauthorizedComponent } from '../shared/unauthorized/unauthorized.component';
import { CustomerAccountComponent } from '../pages/customer/customer-account/customer-account.component';
import { CartComponent } from '../pages/customer/cart/cart.component';
import { SellerDashboardComponent } from '../pages/seller/seller-dashboard/seller-dashboard.component';
import { SellerProductsComponent } from '../pages/seller/seller-products/seller-products.component';
import { AdminDashboardComponent } from '../pages/admin/admin-dashboard/admin-dashboard.component';

import { AdminProductsComponent } from '../pages/admin/components/admin-products/admin-products.component';
import { AdminProductFormComponent } from '../pages/admin/components/admin-product-form/admin-product-form.component';
import { AdminCategoriesComponent } from '../pages/admin/components/admin-categories/admin-categories.component';
import { AdminCategoryFormComponent } from '../pages/admin/components/admin-category-form/admin-category-form.component';
import { AdminOrdersComponent } from '../pages/admin/components/admin-orders/admin-orders.component';
import { AdminSettingsComponent } from '../pages/admin/components/admin-settings/admin-settings.component';
import { AdminOrderDetailsComponent } from '../pages/admin/components/admin-order-details/admin-order-details.component';
import { AdminCustomersComponent } from '../pages/admin/components/admin-customers/admin-customers.component';
import { AdminCustomerDetailsComponent } from '../pages/admin/components/admin-customer-details/admin-customer-details.component';
import { AdminSellersComponent } from '../pages/admin/components/admin-sellers/admin-sellers.component';
import { AdminSellerDetailsComponent } from '../pages/admin/components/admin-seller-details/admin-seller-details.component';
import { AdminReviewsComponent } from '../pages/admin/components/admin-reviews/admin-reviews.component';
import { ProductDetailsComponent } from '../pages/product-details/product-details.component';
import { CheckoutComponent } from '../pages/checkout/checkout/checkout.component';
<<<<<<< Updated upstream
import { OrdersComponent } from '../pages/seller/seller-orders/orders/orders.component';
import { AdminSubcategoryFormComponent } from '../pages/admin/components/admin-subcategory-form/admin-subcategory-form.component';
import { AdminSubcategoriesComponent } from '../pages/admin/components/admin-subcategories/admin-subcategories.component';
=======
import { CategoryComponent } from '../pages/customer/category/category/category.component';
>>>>>>> Stashed changes

export const routes: Routes = [
  // Public routes
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('../auth/authModule/auth.module').then(m => m.AuthModule)
  },
  
  // Customer routes
  {
    path: 'account',
    component: CustomerAccountComponent,
    canActivate: [authGuard]
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard]
  },
  { path: 'category/:id',
    component: CategoryComponent
  },

  // Seller routes
  {
    path: 'seller',
    canActivate: [ roleGuard],
    data: { role: 'seller' },
    children: [
      { path: '', component: SellerDashboardComponent },
      { path: 'products', component: SellerProductsComponent },
      { path: 'orders', component: OrdersComponent },
    ]
  },
  
  // Admin routes
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { role: 'admin' },

    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'products/add', component: AdminProductFormComponent },
      { path: 'products/edit/:id', component: AdminProductFormComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'categories/add', component: AdminCategoryFormComponent },
      { path: 'categories/edit/:id', component: AdminCategoryFormComponent },
      { path: 'subcategories', component: AdminSubcategoriesComponent },
      { path: 'subcategories/add', component: AdminSubcategoryFormComponent },
      { path: 'subcategories/edit/:id', component: AdminSubcategoryFormComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'orders/:id', component: AdminOrderDetailsComponent },
      { path: 'customers', component: AdminCustomersComponent },
      { path: 'customers/:id', component: AdminCustomerDetailsComponent },
      { path: 'sellers', component: AdminSellersComponent },
      { path: 'sellers/:id', component: AdminSellerDetailsComponent },
      { path: 'reviews', component: AdminReviewsComponent },
      { path: 'settings', component: AdminSettingsComponent },
    ]
  },
  //product routes
    
  { path: 'Products/:id',
    component: ProductDetailsComponent 
  },
  // Checkout routes
 
    {
      path: 'checkout',
      component: CheckoutComponent,
    },

  // Utility routes
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    redirectTo: ''
  }

];