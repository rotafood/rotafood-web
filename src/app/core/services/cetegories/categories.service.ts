import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CategoryDto, GetCategoryDto } from '../../interfaces/category';
import { CurrentUserService } from '../current-user/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly apiUrl: string = `${environment.ROTAFOOD_API}/v1/merchants`;

  constructor(
    private readonly http: HttpClient,
    private readonly CurrentUserService: CurrentUserService
  ) {}

  private getMerchantId(): string | undefined | null {
    return this.CurrentUserService.getCurrentUser()?.merchant.id;
  }
  public getAll(): Observable<GetCategoryDto[]> {
    const merchantId = this.getMerchantId()
    const url = `${this.apiUrl}/${merchantId}/categories`;
    return this.http.get<GetCategoryDto[]>(url);
  }

  public updateOrCreate(categoryDto: CategoryDto): Observable<GetCategoryDto[]> {
    const merchantId = this.getMerchantId()
    const url = `${this.apiUrl}/${merchantId}/categories`;
    return this.http.put<GetCategoryDto[]>(url, categoryDto);
  }

  public deleteById(categoryId: string | undefined){
    const merchantId = this.getMerchantId()
    const url = `${this.apiUrl}/${merchantId}/categories/${categoryId}`;
    return this.http.delete<void[]>(url);
  }
}
