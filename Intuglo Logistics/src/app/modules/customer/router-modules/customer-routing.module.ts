
export const customerRouterConfig = [
  {
    path: 'customer/dashboard',
    loadChildren: './modules/customer/router-modules/customer-dashboard.module#CustomerDashboardModule'
  },
  {
    path: 'customer/cart',
    loadChildren: './modules/customer/router-modules/customer-cart.module#CustomerCartModule'
  },
  {
    path: 'customer/profile',
    loadChildren: './modules/customer/router-modules/customer-profile.module#CustomerProfileModule'
  },
  {
    path: 'customer/payment',
    loadChildren: './modules/customer/router-modules/customer-payment.module#CustomerPaymentModule'
  },
  {
    path: 'customer/hswiki',
    loadChildren: './modules/customer/router-modules/customer-hswiki.module#CustomerHswikiModule'
  }
 
];




