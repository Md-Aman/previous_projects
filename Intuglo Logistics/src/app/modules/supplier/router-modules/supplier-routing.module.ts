
export const supplierRouterConfig = [
    {
      path: 'supplier/dashboard',
      loadChildren: './modules/supplier/router-modules/supplier-dashboard.module#SupplierDashboardModule'
    },
    {
      path: 'supplier/profile',
      loadChildren: './modules/supplier/router-modules/supplier-profile.module#SupplierProfileModule'
    },
    {
      path: 'supplier/quotation',
      loadChildren: './modules/supplier/router-modules/supplier-quotation-management.module#SupplierQuotationManagementModule'
    },
    {
      path: 'supplier/newquotation',
      loadChildren: './modules/supplier/router-modules/supplier-new-quotation.module#SupplierNewQuotationModule'
    },
    {
      path: 'supplier/modifyquotation',
      loadChildren: './modules/supplier/router-modules/supplier-modify-quotation.module#SupplierModifyQuotationModule'
    },
    {
      path: 'supplier/viewquotation',
      loadChildren: './modules/supplier/router-modules/supplier-view-quotation.module#SupplierViewQuotationModule'
    },
    {
      path: 'supplier/payment',
      loadChildren: './modules/supplier/router-modules/supplier-payment.module#SupplierPaymentModule'
    },
    {
      path: 'supplier/hswiki',
      loadChildren: './modules/supplier/router-modules/supplier-hswiki.module#SupplierHswikiModule'
    }
  ];
  
  
  
  
  