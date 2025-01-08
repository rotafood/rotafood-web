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
            items: [
                {
                    subtitle: 'Gerenciar Funcionários',
                    href: '/admin/funcionarios/gerenciar'
                },
                {
                    subtitle: 'Horários e Turnos',
                    href: '/admin/funcionarios/horarios'
                },
            ]
        },
        {
            title: 'Configurações',
            icon: 'settings',
            items: [
                {
                    subtitle: 'Restaurante e Cardápio Online',
                    href: '/admin/configuracoes'
                },
                {
                    subtitle: 'Planos e Preços',
                    href: '/admin/configuracoes/planos'
                },
            ]
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
        title: 'Pedidos',
        icon: 'assignment',
        items: [
          {
            subtitle: 'Meus Pedidos',
            href: '/admin/pedidos/listar'
          },
          {
            subtitle: 'Gestor Pedido',
            href: '/admin/pedidos/gestor'
          },
        ]
      }
    ],
    [MerchantPermission.COMMAND]: [
        {
            title: 'Comandas e Mesas',
            icon: 'receipt',
            items: [
                {
                    subtitle: 'Listar Comandas',
                    href: '/admin/comandas'
                },
                {
                    subtitle: 'Nova Comanda',
                    href: '/admin/comandas/nova'
                },
            ]
        },
    ],
    [MerchantPermission.LOGISTIC]: [
      {
        title: 'Logistica',
        icon: 'map',
        items: [
          {
            subtitle: 'Visualizar Mapa',
            href: '/admin/logistica/mapa'
          },
          {
            subtitle: 'Gerar Rotas',
            href: '/admin/logistica/gerar'
          },
        ]
      }
    ]
};
  