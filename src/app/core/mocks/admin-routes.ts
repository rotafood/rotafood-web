import { MerchantPermission } from "../enums/merchant-user";
import { AdminRoute } from "../interfaces/admin-route";



export const allRoutes: Record<string, AdminRoute[]> = {
    [MerchantPermission.MERCHANT]: [
        // {
        //     title: 'DashBoards',
        //     icon: 'insert_chart',
        //     items: [
        //         {
        //             subtitle: 'Faturamento',
        //             href: '/admin/financeiro/faturamento'
        //         },
        //         {
        //             subtitle: 'Vendas',
        //             href: '/admin/financeiro/vendas'
        //         },
        //         {
        //             subtitle: 'Rotas',
        //             href: '/admin/financeiro/vendas'
        //         },
        //     ]
        // },
        {
            title: 'Funcionários',
            icon: 'group',
            href: '/admin/funcionarios/gerenciar'
            
        },
        {
            title: 'Configurações Cardápio Online',
            icon: 'settings',
            href: '/admin/configuracoes'
        },
         {
            title: 'Planos ',
            icon: 'settings',
            href: '/admin/configuracoes/planos'

         }
    ],
    [MerchantPermission.CATALOG]: [
        {
            title: 'Cardápios',
            icon: 'menu_book',
            href: '/admin/cardapios'
        }
    ],
    [MerchantPermission.INTEGRATION]: [
      // {
      //   title: 'Integrações',
      //   icon: 'sync_alt',
      //   items: [
      //     {
      //       subtitle: 'Integração IFood',
      //       href: '/admin/integracoes/ifood'
      //     },
      //     {
      //       subtitle: 'Outras Integrações',
      //       href: '/admin/integracoes/outras'
      //     },
      //   ]
      // }
    ],
    [MerchantPermission.ORDER]: [
      {
        title: 'Listar Pedidos',
        icon: 'assignment',
        href: '/admin/pedidos/listar'
      },
       {
        title: 'Gestor de Pedidos',
        icon: 'assignment',
        href: '/admin/pedidos/gestor'

       }
    ],
    [MerchantPermission.COMMAND]: [
        {
            title: 'Comandas e Mesas',
            icon: 'receipt',
            href: '/admin/comandas'
        },
    ],
    [MerchantPermission.LOGISTIC]: [
      {
        title: 'Logistica',
        icon: 'map',
        href: '/admin/logistica'
      }
    ]
};
  