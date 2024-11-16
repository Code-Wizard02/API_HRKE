# LoginAngularHRKE

## 1. Creando Nuevo Proyecto
Crear un nuevo proyecto angular: `ng new Login_Angular_HRKE`. Dirigirse a la carpeta creada: `cd Login_Angular_HRKE`. Abrir el proyecto con el editor de código preferido.
![Creando proyecto Angular](/src/img/1.png)

## 2. Programando Consumo
Creamos un servicio "auth" dentro de una nueva carpeta services: `ng generate service services/auth`.
![Auth Service](/src/img/2.png)

### 2.1. Modulos
Importamos los modulos y clases necesarias para manejar la validación de credenciales dentro del login utilizando una [API](https://api.escuelajs.co/api/v1/users).

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
```

### 2.2. Lógica
Complementamos con lógica el resto del servicio "auth" para consumir la [API](https://api.escuelajs.co/api/v1/users):

```typescript
    
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
            localStorage.setItem('token', 'dummy-token');
            return true;
          } else {
            return false;
          }
        })
      );
  }
}
```

### 2.3 Configuración
Agregamos el provide correspondiente para el consumo de nuestra [API](https://api.escuelajs.co/api/v1/users).

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(),provideHttpClient()],
};
```

## 3. Login Angular Material
Agregamos la libreria Material para el diseño de nuestros componentes: `ng add @angular/material`. Y creamos un componente Login: `ng generate component Login`.
![Creando Componente Login](/src/img/3.png)

### 3.1 Plantilla Login
Con ayuda de Material UI, diseñamos el login a nuestro gusto. Añadiendo una funcion login que se configura dentro del componente login posteriormente.
```HTML
<mat-card>
    <mat-card-header>
        <h2>Login</h2>
    </mat-card-header>
    <mat-card-content>
        <form #loginForm="ngForm" (submit)="login()">
            <mat-error *ngIf="!loginValid">
                El usuario y contraseña no son correctos!.
            </mat-error>
            <mat-form-field>
                <mat-label>Usuario</mat-label>
                <input matInput placeholder="Usuario" [(ngModel)]="user" name="username" required>
            </mat-form-field>
            <mat-form-field>
                <mat-label>Contraseña</mat-label>
                <input matInput type="password" placeholder="Contraseña" [(ngModel)]="password" name="password"
                    required>
            </mat-form-field>
            <button mat-raised-button color="primary" [disabled]="!loginForm.form.valid">Login</button>
        </form>
    </mat-card-content>
</mat-card>
```
### 3.2 Lógica del Login
Importamos los modulos y clases que requerimos para el manejo del diseño y funcionalidad de nuestro login. Agregamos de igual forma el servicio "Auth" que anteriormente creamos.
```typescript
import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {AuthService} from '../services/auth.service';
```

Continuamos con la importacion de modulos con un array de los mismos:
```typescript

const materialModules = [
  RouterOutlet,
  FormsModule,
  CommonModule,
  MatCardModule,
  MatInputModule,
  MatButtonModule,
];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...materialModules],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```
Diseñamos la logica de nuestro componente, emitiendo un evento de login existoso que nos servirá mas adelante.

La validacion exitosa permite redirigir al usuario al dashboard, ademas de emitir el user capturado de la [API](https://api.escuelajs.co/api/v1/users).

```typescript
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<string>();
  constructor(private authService: AuthService, private router: Router) {}
  user: string = '';
  password: string = '';
  loginValid: boolean = true;
  isLoggedIn: boolean = false;

  login() {
    this.authService.login(this.user, this.password).subscribe(
      success => {
        console.log('Login success:', success);
        if (success) {
          this.isLoggedIn = true;
          this.loginSuccess.emit(this.user);
          this.router.navigate(['/dashboard']); // Redirige al usuario a la página principal
        } else {
          this.loginValid = false;
        }
      },
      error => {
        console.log('Login error:', error);
        this.loginValid = false;
      }
    );
  }
}
```
### 3.3 Diseño del Login
Agregamos el diseño de algunas clases de nuestro componente.
```css
mat-card {
    max-width: 400px;
    margin: 2em auto;
    text-align: center;
}

mat-form-field {
    display: block;
    }
    
    .card-title {
    color: #646464;
    }
    
    :host {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    }

mat-card-header {
    justify-content: center;
    color: #f4e9e9;
    }
```

## 4.Dashboard Angular Material
Creamos un componente Dashboard: `ng generate component Dashboard`.
![Creando Componente Dashboard](/src/img/4.png)

### 4.1 Plantilla Dashboard
Utilizamos una plantilla que nos proporciona Material UI, de un menú que se muestra en la parte superior de nuestra pantalla.
```HTML
<mat-toolbar>
    <button mat-icon-button class="example-icon" aria-label="Example icon-button with menu icon">
      <mat-icon>menu</mat-icon>
    </button>
    <span>Bienvenido: {{ userName }}</span>
    <span class="example-spacer"></span>
    <button mat-icon-button class="example-icon favorite-icon" aria-label="Example icon-button with heart icon">
      <mat-icon>favorite</mat-icon>
    </button>
    <button mat-icon-button class="example-icon" aria-label="Example icon-button with share icon">
      <mat-icon>share</mat-icon>
    </button>
  </mat-toolbar>
  
```

### 4.2 Logica del Dashboard
Importamos los modulos y clases necesarias para el funcionamiento del menú.
Ademas, capturamos el "username" emitido en la logica del [Login](#3.2-Lógica_del_Login).

```typescript
import {Component, Input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @Input() userName: string = '';
}
```

### 4.3 Diseño del Dashboard
```css
.example-spacer {
    flex: 1 1 auto;
  }
```

## 5. Rutas
Definimos las rutas que utilizaremos dentro de nuestro proyecto, la cual el solo una, dentro del "app.route.ts":
```typescript
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
];
```

## 6. Resultados

Ejecutamos nuestro proyecto: `ng serve`.

![Login](/src/img/5.png)


![Validacion de usuario que no pertenece](/src/img/6.png)


![Usuario Valido](/src/img/7.png)


![Mostrando Menú a Usuario Validado](/src/img/8.png)



