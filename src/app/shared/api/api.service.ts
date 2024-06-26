import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../enum/country';
import { SubmitBody } from '../interfaces/submit-body.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  public getRegion(country: Country): Observable<{ region: string }> {
    return this.http.post<{ region: string }>('/api/regions', { country });
  }

  public checkUser(username: string): Observable<{ isAvailable: boolean }> {
    return this.http.post<{ isAvailable: boolean }>('/api/checkUsername', {
      username,
    });
  }

  public submitForm(body: SubmitBody[]): Observable<{ result: string }> {
    console.warn(body);
    return this.http.post<{ result: string }>('/api/submitForm', {
      body,
    });
  }
}
