import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api.escuelajs.co/api/v1/users';

  constructor(private http:HttpClient) { }
  login(username: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        map(users => {
          const user = users.find(u => u.email === username && u.password === password);
          if (user) {
            localStorage.setItem('token', 'dummy-token'); // Puedes generar un token real aquí
            return true;
          } else {
            return false;
          }
        })
      );
  }
}