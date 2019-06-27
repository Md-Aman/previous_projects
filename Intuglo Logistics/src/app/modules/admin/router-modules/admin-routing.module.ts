
export const adminRouterConfig = [
    {
      path: 'admin/dashboard',
      loadChildren: './modules/admin/router-modules/admin-dashboard.module#AdminDashboardModule'
    },
    {
      path: 'admin/quotation',
      loadChildren: './modules/admin/router-modules/admin-quotation-management.module#AdminQuotationManagementModule'
    },
    {
      path: 'admin/user',
      loadChildren: './modules/admin/router-modules/admin-user-management.module#AdminUserManagementModule'
    },

    {
      path: 'admin/employee-report',
      loadChildren: './modules/admin/router-modules/admin-employee-report.module#AdminEmployeeReportModule'
    },
    {
      path: 'admin/payment-report',
      loadChildren: './modules/admin/router-modules/admin-payment-report.module#AdminPaymentReportModule'
    }
  ];
  
  
  
  
  