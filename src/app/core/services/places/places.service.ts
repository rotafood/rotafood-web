
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddressDto } from '../../interfaces/shared/address';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private readonly apiUrl: string = `${environment.ROTAFOOD_API}/v1/places`;

  constructor(private http: HttpClient) {}

  getAddressByCep(cep: string): Observable<AddressDto> {
    return this.http.get<AddressDto>(`${this.apiUrl}/cep/${cep}`);
  }

  searchAddress(query: string): Observable<AddressDto[]> {
    return this.http.get<AddressDto[]>(`${this.apiUrl}/search`, {
      params: { q: query },
    });
  }
}
