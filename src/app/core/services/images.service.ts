import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CurrentUserService } from './current-user/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private readonly apiUrl = `${environment.ROTAFOOD_API}/v1/merchants`;

  constructor(private readonly http: HttpClient, 
    private readonly CurrentUserService: CurrentUserService
  ) {}

  private getMerchantId(): string | undefined | null {
    return this.CurrentUserService.getCurrentUser()?.merchant.id;
  }
  uploadImage(file: File): Observable<HttpEvent<any>> {
    const merchantId = this.getMerchantId()
    const formData = new FormData();
    formData.append('image', file);

    const url = `${this.apiUrl}/${merchantId}/images`;
    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }


  getImages(): Observable<string[]> {
    const merchantId = this.getMerchantId()
    const url = `${this.apiUrl}/${merchantId}/images`;
    return this.http.get<string[]>(url);
  }


  deleteImage(imageId: string): Observable<void> {
    const merchantId = this.getMerchantId()
    const url = `${this.apiUrl}/${merchantId}/images/${imageId}`;
    return this.http.delete<void>(url);
  }
}
