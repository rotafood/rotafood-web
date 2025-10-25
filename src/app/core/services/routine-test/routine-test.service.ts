import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddressDto } from '../../interfaces/shared/address';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Vrp } from '../../interfaces/vrp/vrp';

@Injectable({
  providedIn: 'root',
})
export class RoutineTestService {

  private readonly apiUrl: string = environment.ROTAFOOD_API;
  constructor(private readonly http: HttpClient) { }

  generateAndSolveTestVrp(points: number, lat: number, lng: number): Observable<Vrp> {
    
    const url = `${this.apiUrl}/logistic/vrp/test/generate`;

    let params = new HttpParams();
    params = params.append('points', points.toString());
    params = params.append('lat', lat.toString());
    params = params.append('lng', lng.toString());

    return this.http.post<Vrp>(url, null, { params });
  }
}
