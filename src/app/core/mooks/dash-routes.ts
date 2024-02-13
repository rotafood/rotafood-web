export const AllDashRoutes = [
    {
        title: 'Pedidos',
        icon: 'assignment',
        items: [
            {
                subtitle: 'Listar Pedidos',
                href: '/pedidos/listar'
            },
            {
                subtitle: 'Adicionar Pedido',
                href: '/pedidos/novo'
            },
        ]
    },
    {
        title: 'Comandas',
        icon: 'receipt',
        items: [
            {
                subtitle: 'Listar Comandas',
                href: '/comandas/listar'
            },
            {
                subtitle: 'Nova Comanda',
                href: '/comandas/nova'
            },
        ]
    },
    {
        title: 'Rotas',
        icon: 'map',
        items: [
            {
                subtitle: 'Visualizar Mapa',
                href: '/rotas/mapa'
            },
            {
                subtitle: 'Gerar Rotas',
                href: '/rotas/gerar'
            },
        ]
    },
    {
        title: 'Produtos',
        icon: 'local_offer',
        items: [
            {
                subtitle: 'Listar Produtos',
                href: '/produtos/listar'
            },
            {
                subtitle: 'Adicionar Produto',
                href: '/produtos/novo'
            },
        ]
    },
    {
        title: 'Cardápio Online',
        icon: 'menu_book',
        items: [
            {
                subtitle: 'Visualizar Cardápio',
                href: '/cardapio/visualizar'
            },
            {
                subtitle: 'Editar Cardápio',
                href: '/cardapio/editar'
            },
        ]
    },
    {
        title: 'Integrações',
        icon: 'sync_alt',
        items: [
            {
                subtitle: 'Integração IFood',
                href: '/integracoes/ifood'
            },
            {
                subtitle: 'Outras Integrações',
                href: '/integracoes/outras'
            },
        ]
    },
    {
        title: 'DashBoards',
        icon: 'attach_money',
        items: [
            {
                subtitle: 'Faturamento',
                href: '/financeiro/faturamento'
            },
            {
                subtitle: 'Vendas',
                href: '/financeiro/vendas'
            },
            {
                subtitle: 'Rotas',
                href: '/financeiro/vendas'
            },
        ]
    },
    {
        title: 'Funcionários',
        icon: 'group',
        items: [
            {
                subtitle: 'Gerenciar Funcionários',
                href: '/funcionarios/gerenciar'
            },
            {
                subtitle: 'Horários e Turnos',
                href: '/funcionarios/horarios'
            },
        ]
    },
    {
        title: 'Configurações',
        icon: 'settings',
        items: [
            {
                subtitle: 'Configurações do Restaurante',
                href: '/configuracoes/restaurante'
            },
            {
                subtitle: 'Planos e Preços',
                href: '/configuracoes/planos'
            },
        ]
    }
];
