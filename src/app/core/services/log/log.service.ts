import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private apiUrl: string = `${environment.ROTAFOOD_API}/v1/logs`;

  constructor(private http: HttpClient) {}

  postLog(date: Date, url: string) {
    return this.http.get<{ ip: string }>('https://api.ipify.org/?format=json').pipe().subscribe({
      next: (ipResponse) => {
        this.http.get<any>(`https://ipinfo.io/${ipResponse.ip}/json`).pipe().subscribe({
          next: (locationResponse) => {
            this.http.post(`${this.apiUrl}`, {
              date: date,
              url: url,
              location: `${locationResponse.city}, ${locationResponse.region}, ${locationResponse.country}`,
            }).pipe().subscribe({
              next: (response) => {console.log(response)},
            });
          }
        })
      }
    })
  }
}
