import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrentUserService } from '../current-user/current-user.service';
import { MerchantUser } from '../../interfaces/merchant-user';
import { allRoutes } from '../../mocks/admin-routes';
import { AdminRoute } from '../../interfaces/admin-route';
import { MerchantPermission } from '../../enums/merchant-user';

@Injectable({
  providedIn: 'root'
})
export class MyRoutesService {
  private readonly routesSubject = new BehaviorSubject<AdminRoute[]>([]);
  public routes$: Observable<AdminRoute[]> = this.routesSubject.asObservable();

  constructor(private readonly currentUserService: CurrentUserService) {
    this.currentUserService.getUser().subscribe((user: MerchantUser | null) => {
      if (user && user.merchantPermissions) {
        const filteredRoutes = this.filterRoutesByPermissions(user.merchantPermissions);
        this.routesSubject.next(filteredRoutes);
      }
    });
  }

  private filterRoutesByPermissions(permissions: string[]): AdminRoute[] {
    if (!permissions || permissions.length === 0) {
        console.warn('Nenhuma permissão disponível para este usuário.');
        return [];
    }

    const orderedCategories = [
        MerchantPermission.CATALOG,
        MerchantPermission.ORDER,
        MerchantPermission.COMMAND,
        MerchantPermission.LOGISTIC,
        MerchantPermission.INTEGRATION,
        MerchantPermission.MERCHANT
    ];

    const orderedPermissions = orderedCategories.filter(category => permissions.includes(category));

    if (orderedPermissions.length === 0) {
        console.warn('Nenhuma permissão válida encontrada para este usuário.');
    }

    let orderedRoutes = orderedPermissions
        .map(category => allRoutes[category])
        .flat();

    return orderedRoutes;
}

}
