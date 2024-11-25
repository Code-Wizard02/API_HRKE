import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticaded = false;
  
  private apiUrl = 'https://api.escuelajs.co/api/v1/users';

  constructor(private http:HttpClient, private router:Router) { }
  
  getUsers():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`);
  }

  login(username: string, password: string): Observable<{success: boolean, avatar?:string}> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        map(users => {
          const user = users.find(u => u.email === username && u.password === password);
          if (user) {
            localStorage.setItem('token', 'dummy-token'); // Puedes generar un token real aquí
            localStorage.setItem('isAuthenticaded', 'true');
            localStorage.setItem('userName', user.email);
            localStorage.setItem('avatar', user.avatar);
            return {success: true,avatar: user.avatar};
          } else {
            return {success: false};
          }
        })
      );
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticaded');
    localStorage.removeItem('userName');
    localStorage.removeItem('avatar');
    this.router.navigate(['/login']);
  }

  checkAuthentication(): boolean {
    return localStorage.getItem('isAuthenticaded') === 'true';
  }

  getUserName(): string {
    return localStorage.getItem('userName') || '';
  }

  getAvatar(): string {
    return localStorage.getItem('avatar') || '';
  }

}