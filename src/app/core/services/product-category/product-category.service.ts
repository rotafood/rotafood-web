import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductCategory } from '../../interfaces/product-category';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  private apiUrl: string = `${environment.ROTAFOOD_API}/product_category`;

  constructor(private http: HttpClient) { }

  getProductCategories(): Observable<ProductCategory[] | any> {
    return this.http.get<ProductCategory[]>(this.apiUrl);
  }

  getProductCategoryById(id: number): Observable<ProductCategory | any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ProductCategory>(url);
  }

  createProductCategory(productCategory: ProductCategory): Observable<ProductCategory | any> {
    return this.http.post<ProductCategory>(this.apiUrl, productCategory);
  }

  deleteProductCategoryById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}