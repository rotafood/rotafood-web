import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrentlyUserService } from '../currently-user/currently-user.service';
import { MerchantUser, ModulePermission } from '../../interfaces/merchant-user';
import { allRoutes } from '../../mocks/admin-routes';

@Injectable({
  providedIn: 'root'
})
export class MyRoutesService {
  private routesSubject = new BehaviorSubject<any[]>([]);
  public routes$: Observable<any[]> = this.routesSubject.asObservable();

  constructor(private currentUserService: CurrentlyUserService) {
    this.currentUserService.getUser().subscribe((user: MerchantUser | null) => {
      if (user && user.permissions) {
        const filteredRoutes = this.filterRoutesByPermissions(user.permissions);
        this.routesSubject.next(filteredRoutes);
      }
    });
  }

  private filterRoutesByPermissions(permissions: string[]): any[] {
    const orderedCategories = [
      ModulePermission.PRODUCTS,
      ModulePermission.ORDERS,
      ModulePermission.COMMANDS,
      ModulePermission.CATALOGS,
      ModulePermission.ROUTES,
      ModulePermission.INTEGRATION,
      ModulePermission.MERCHANT
  ];

  // Organize as permissões recebidas na ordem desejada
  const orderedPermissions = orderedCategories.filter(category => permissions.includes(category));

  // Mapeie as permissões organizadas para as rotas correspondentes
  let orderedRoutes = orderedPermissions
      .map(category => allRoutes[category])
      .flat();

  // Retorne as rotas ordenadas
  return orderedRoutes;
  }
}
