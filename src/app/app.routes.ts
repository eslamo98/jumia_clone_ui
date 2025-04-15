import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';
import { HomePageComponent } from '../pages/public/home-page/home-page.component';
import { ProductsComponent } from '../pages/public/products/products.component';
import { UnauthorizedComponent } from '../shared/unauthorized/unauthorized.component';
import { CustomerAccountComponent } from '../pages/customer/customer-account/customer-account.component';
import { CartComponent } from '../pages/customer/cart/cart.component';
import { SellerDashboardComponent } from '../pages/seller/seller-dashboard/seller-dashboard.component';
import { SellerProductsComponent } from '../pages/seller/seller-products/seller-products.component';
import { AdminDashboardComponent } from '../pages/admin/admin-dashboard/admin-dashboard.component';
import { ProductCardComponent } from '../pages/product-card/product-card.component';
import { ProductDetailsComponent } from '../pages/product-details/product-details.component';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    component: HomePageComponent
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
  
  // Seller routes
  {
    path: 'seller',
    canActivate: [ roleGuard],
    data: { role: 'seller' },
    children: [
      { path: '', component: SellerDashboardComponent },
      { path: 'products', component: SellerProductsComponent },
    ]
  },
  
  // Admin routes
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { role: 'admin' },
    component: AdminDashboardComponent
  },
    //product routes
    {
      path: 'product-card',
      component: ProductCardComponent,  
    },
    { path: 'products/:id',
      component: ProductDetailsComponent 
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