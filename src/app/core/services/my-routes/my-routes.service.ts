import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrentlyUserService } from '../currently-user/currently-user.service';
import { MerchantUser } from '../../interfaces/merchant-user';
import { allRoutes } from '../../mooks/dash-routes';

@Injectable({
  providedIn: 'root'
})
export class MyRoutesService {
  private dashRoutesSubject = new BehaviorSubject<any[]>([]);
  public dashRoutes$: Observable<any[]> = this.dashRoutesSubject.asObservable();

  constructor(private currentUserService: CurrentlyUserService) {
    this.currentUserService.getUser().subscribe((user: MerchantUser | null) => {
      if (user && user.permissions) {
        const filteredRoutes = this.filterRoutesByPermissions(user.permissions);
        this.dashRoutesSubject.next(filteredRoutes);
      }
    });
  }

  private filterRoutesByPermissions(permissions: string[]): any[] {
    return permissions
      .map(perm => allRoutes[perm])
      .filter(route => route != null)
      .flat();
  }
}
