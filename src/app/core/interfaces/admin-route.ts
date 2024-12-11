export interface AdminRoute {
    title: string;
    icon: string;
    href?: string;
    items?: {
        subtitle: string;
        href: string;
    }[];
}