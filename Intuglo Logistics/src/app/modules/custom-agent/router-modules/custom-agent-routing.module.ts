export const customAgentRouterConfig = [
    {
        path: 'customagent/dashboard',
        loadChildren: './modules/custom-agent/router-modules/custom-agent-dashboard.module#CustomAgentDashboardModule'
    },
    {
        path: 'customagent/profile',
        loadChildren: './modules/custom-agent/router-modules/custom-agent-profile.module#CustomAgentProfileModule'
    },
    {
        path: 'customagent/declaration',
        loadChildren: './modules/custom-agent/router-modules/custom-agent-declaration.module#CustomAgentDeclarationModule'
    },
    {
        path: 'customagent/hswiki',
        loadChildren: './modules/custom-agent/router-modules/custom-agent-hswiki.module#CustomAgentHswikiModule'
    }
];