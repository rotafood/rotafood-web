import { AdminRoute } from "../interfaces/admin-route";
import { ModulePermission } from "../interfaces/merchant-user";



export const allRoutes: Record<string, AdminRoute[]> = {
    [ModulePermission.MERCHANT]: [
        {
            title: 'DashBoards',
            icon: 'insert_chart',
            items: [
                {
                    subtitle: 'Faturamento',
                    href: '/admin/financeiro/faturamento'
                },
                {
                    subtitle: 'Vendas',
                    href: '/admin/financeiro/vendas'
                },
                {
                    subtitle: 'Rotas',
                    href: '/admin/financeiro/vendas'
                },
            ]
        },
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
                    subtitle: 'Configurações do Restaurante',
                    href: '/admin/configuracoes/restaurante'
                },
                {
                    subtitle: 'Planos e Preços',
                    href: '/admin/configuracoes/planos'
                },
            ]
        }
    ],
    [ModulePermission.CATALOGS]: [
        {
            title: 'Cardápio Online',
            icon: 'menu_book',
            items: [
                {
                    subtitle: 'Visualizar Cardápio',
                    href: '/admin/cardapio/visualizar'
                },
                {
                    subtitle: 'Editar Cardápio',
                    href: '/admin/cardapio/editar'
                },
            ]
        }
    ],
    [ModulePermission.INTEGRATION]: [
      {
        title: 'Integrações',
        icon: 'sync_alt',
        items: [
          {
            subtitle: 'Integração IFood',
            href: '/admin/integracoes/ifood'
          },
          {
            subtitle: 'Outras Integrações',
            href: '/admin/integracoes/outras'
          },
        ]
      }
    ],
    [ModulePermission.PRODUCTS]: [
      {
        title: 'Produtos',
        icon: 'local_offer',
        items: [
          {
            subtitle: 'Listar Produtos',
            href: '/admin/produtos/listar'
          },
          {
            subtitle: 'Adicionar Produto',
            href: '/admin/produtos/novo'
          },
        ]
      },
      {
        title: 'Categorias',
        icon: 'category',
        items: [
          {
            subtitle: 'Listar Categorias',
            href: '/admin/categorias'
          },
          {
            subtitle: 'Adicionar Categorias',
            href: '/admin/categorias/novo'
          },
        ]
      }
    ],
    [ModulePermission.ORDERS]: [
      {
        title: 'Pedidos',
        icon: 'assignment',
        items: [
          {
            subtitle: 'Listar Pedidos',
            href: '/admin/pedidos/listar'
          },
          {
            subtitle: 'Adicionar Pedido',
            href: '/admin/pedidos/novo'
          },
        ]
      }
    ],
    [ModulePermission.COMMANDS]: [
        {
            title: 'Comandas',
            icon: 'receipt',
            items: [
                {
                    subtitle: 'Listar Comandas',
                    href: '/admin/comandas/listar'
                },
                {
                    subtitle: 'Nova Comanda',
                    href: '/admin/comandas/nova'
                },
            ]
        },
    ],
    [ModulePermission.ROUTES]: [
      {
        title: 'Rotas',
        icon: 'map',
        items: [
          {
            subtitle: 'Visualizar Mapa',
            href: '/admin/rotas/mapa'
          },
          {
            subtitle: 'Gerar Rotas',
            href: '/admin/rotas/gerar'
          },
        ]
      }
    ],
    [ModulePermission.DRIVERS]: [
        {
            title: 'Entregadores',
            icon: 'motorcycle',
            items: [
              {
                subtitle: 'Listar',
                href: '/admin/rotas/mapa'
              },
              {
                subtitle: 'Incluir',
                href: '/admin/rotas/gerar'
              },
            ]
          }
    ]
};
  