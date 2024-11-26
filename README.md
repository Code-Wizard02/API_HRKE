# LoginAngularHRKE

## 1. Creando Nuevo Proyecto

Crear un nuevo proyecto angular: `ng new Login_Angular_HRKE`. Dirigirse a la carpeta creada: `cd Login_Angular_HRKE`. Abrir el proyecto con el editor de código preferido.

![Creando proyecto Angular](/src/img/1.png)

## 2. Programando Consumo

### 2.1 AuthService

Creamos un servicio "auth" dentro de una nueva carpeta services: `ng generate service services/auth`.

![Auth Service](/src/img/2.png)

#### 2.1.1 Modulos

Importamos los modulos y clases necesarias para manejar la validación de credenciales dentro del login utilizando una [API](https://api.escuelajs.co/api/v1/users).

```typescript
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
```

#### 2.1.2 Lógica

Complementamos con lógica el resto del servicio "auth" para consumir la [API](https://api.escuelajs.co/api/v1/users):

```typescript
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "https://api.escuelajs.co/api/v1/users";

  constructor(private http: HttpClient) {}
  login(username: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((users) => {
        const user = users.find((u) => u.email === username && u.password === password);
        if (user) {
          localStorage.setItem("token", "dummy-token");
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
```

#### 2.1.3 Configuración

Agregamos el provide correspondiente para el consumo de nuestra [API](https://api.escuelajs.co/api/v1/users).

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideHttpClient } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideHttpClient()],
};
```

### 2.2 MarvelService

Creamos un servicio "marvel" dentro de una nueva carpeta services: `ng generate service services/marvel`.

![Marvel Service](/src/img/9.png)

#### 2.2.1 Modulos

Importamos los modulos y clases necesarias para manejar la validación de credenciales dentro del login utilizando una [API](https://gateway.marvel.com/v1/public).

```typescript
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import md5 from "md5";
```

#### 2.2.2 Lógica

Complementamos con lógica el resto del servicio "marvel" para consumir la [API](https://gateway.marvel.com/v1/public):

```typescript
@Injectable({
  providedIn: "root",
})
export class MarvelService {
  private apiUrl = "https://gateway.marvel.com/v1/public";
  private publicKey = "dfeee3bac7f9921cf4b90424645e8a40";
  private privateKey = "08a5147d0437aebdba8adf7e90c64d7e151cda3b";

  constructor(private http: HttpClient) {}
  getCharacters(limit: number, offset: number): Observable<any> {
    const ts = new Date().getTime().toString();
    const hash = md5(ts + this.privateKey + this.publicKey);
    const params = new HttpParams().set("ts", ts).set("apikey", this.publicKey).set("hash", hash).set("limit", limit.toString()).set("offset", offset.toString());
    return this.http.get(`${this.apiUrl}/characters`, { params });
  }
}
```

#### 2.2.3 Configuración

Ya no es necesario agregar el provide para el consumo de nuestra [API](https://gateway.marvel.com/v1/public), ya que fue agregado anteriormente.

```typescript
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideHttpClient()],
};
```

## 3. Componentes

### 3.1 Login Angular Material

Agregamos la libreria Material para el diseño de nuestros componentes: `ng add @angular/material`. Y creamos un componente Login: `ng generate component Login`.

![Creando Componente Login](/src/img/3.png)

#### 3.1.1 Plantilla Login

Con ayuda de Material UI, diseñamos el login a nuestro gusto. Añadiendo una funcion login que se configura dentro del componente login posteriormente.

```HTML
<div class="background-blur"></div>
<div class="content">
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
                <button mat-raised-button [disabled]="!loginForm.form.valid">Login</button>
            </form>
        </mat-card-content>
    </mat-card>
</div>
```

#### 3.1.2 Lógica del Login

Importamos los modulos y clases que requerimos para el manejo del diseño y funcionalidad de nuestro login. Agregamos de igual forma el servicio "Auth" que anteriormente creamos.

```typescript
import { Component, ChangeDetectionStrategy, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "../services/auth.service";
```

Continuamos con la importacion de modulos con un array de los mismos:

```typescript
const materialModules = [
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

La validacion exitosa permite redirigir al usuario al dashboard, ademas de emitir el user capturado de la [API](https://gateway.marvel.com/v1/public).

```typescript
export class LoginComponent {
  user: string = "";
  password: string = "";
  loginValid = true;
  @Output() loginSuccess = new EventEmitter<{
    userName: string;
    avatar: string;
  }>();

  constructor(private authService: AuthService, private router: Router) {}

  isLoggedIn: boolean = false;

  login(): void {
    this.authService.login(this.user, this.password).subscribe(
      (response) => {
        if (response.success) {
          this.isLoggedIn = true;
          this.loginSuccess.emit({
            userName: this.user,
            avatar: response.avatar!,
          });
          this.router.navigate(["/dashboard"]);
        } else {
          this.loginValid = false;
        }
      },
      (error) => {
        console.log("Login error:", error);
        this.loginValid = false;
      }
    );
  }
}
```

#### 3.1.3 Diseño del Login

Agregamos el diseño de algunas clases de nuestro componente.

```css
mat-card {
  max-width: 400px;
  margin: 2em auto;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.6);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

mat-form-field {
  display: block;
}

h2 {
  color: #f4e9e9;
  font-family: "Courier New", Courier, monospace;
  font-size: 5em;
  margin-top: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 5px;
  text-transform: uppercase;
  font-weight: bold;
}

mat-card-header {
  justify-content: center;
  color: #f4e9e9;
}

.background-blur {
  background-image: url("../../img/background.2.jpeg");
  background-size: cover;
  background-position: center;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
}

button {
  background-color: #f4e9e9;
  color: #084d3e;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
}
:host {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

mat-form-field {
  width: 100%;
}
```

### 3.2 Dashboard Angular Material

Creamos un componente Dashboard: `ng generate component Dashboard`.

![Creando Componente Dashboard](/src/img/4.png)

#### 3.2.1 Plantilla Dashboard

Utilizamos una plantilla que nos proporciona Material UI, de un menú que se muestra en la parte superior de nuestra pantalla.

```HTML
<div class="top">
  <mat-toolbar>
    <h1 class="title">CONSUMO DE API</h1>
    <p class="example-spacer"></p>
    <span class="userName">{{ userName }}</span>
    <button mat-icon-button [matMenuTriggerFor]="userMenu">
      <img [src]="userAvatar" alt="User Avatar" class="user-avatar" />
    </button>
    <mat-menu #userMenu="matMenu">
      <button mat-menu-item>Perfil</button>
      <button mat-menu-item (click)="logout()">LogOut</button>
    </mat-menu>
  </mat-toolbar>
</div>
```

#### 3.2.2 Logica del Dashboard

Importamos los modulos y clases necesarias para el funcionamiento del menú.
Ademas, capturamos el "username" y el "avatar" emitido en la logica del [Login](#3.2-Lógica_del_Login).

```typescript
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  @Input() userName: string = '';
  @Input() userAvatar: string = '';
  constructor(private authService: AuthService) {}
```

Posteriormente se agrega una funcion:`logout()`

```typescript
logout() {
    this.authService.logout();
    localStorage.removeItem('token');
    window.location.reload();
  }
```

#### 3.2.3 Diseño del Dashboard

```css
.example-spacer {
  flex: 1 1 auto;
}

.user-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

mat-toolbar {
  display: flex;
  justify-content: space-between;
  background: rgb(60, 6, 114);
  background: linear-gradient(180deg, rgba(60, 6, 114, 0.8772759103641457) 0%, rgba(120, 40, 40, 0.9360994397759104) 50%, rgba(10, 2, 33, 1) 100%);
  z-index: 10;
}

.title {
  color: #f4e9e9;
  font-family: "Courier New", Courier, monospace;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 5px;
  text-transform: uppercase;
  font-weight: bold;
}

.userName {
  color: #f4e9e9;
  font-family: "Courier New", Courier, monospace;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 5px;
  text-transform: uppercase;
  font-weight: bold;
}
```

### 3.3 Marvel-Table Angular Material

Creamos un componente MarvelTable: `ng generate component MarvelTable`.

![Creando Componente MarvelTable](/src/img/10.png)

#### 3.3.1 Plantilla Marvel-Table

Utilizamos una plantilla que nos proporciona Material UI, de un menú que se muestra en la parte superior de nuestra pantalla.

```HTML
<div class="background-blur"></div>
<div [ngClass]="{'table-container':true,'loading':isLoading}" class="mat-elevation-z8">

  <input class="finder" matInput [(ngModel)]="filterValue" (ngModelChange)="applyFilter()"
    placeholder="Buscar personajes">

  <div *ngIf="!isLoading" class="loading">
    <mat-spinner diameter="50"></mat-spinner>
  </div>

  <div class="divtabla">
    <table mat-table [dataSource]="dataSource" matSort>

      <!-- ID Column -->
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
        <td mat-cell *matCellDef="let character"> {{character.id}} </td>
      </ng-container>

      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Name </th>
        <td mat-cell *matCellDef="let character"> {{character.name}} </td>
      </ng-container>

      <!-- Thumbnail Column -->
      <ng-container matColumnDef="thumbnail">
        <th mat-header-cell *matHeaderCellDef> Thumbnail </th>
        <td mat-cell *matCellDef="let character">
          <img [src]="character.thumbnail.path + '.' +character.thumbnail.extension" alt="{{character.name}}"
            class="thumbnail">
        </td>
      </ng-container>

      <!-- Actions Column -->
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Actions </th>
        <td mat-cell *matCellDef="let character">

          <button class="edit" mat-icon-button (click)="openEditCharacter(character)">
            <mat-icon>edit</mat-icon>
          </button>

          <button class="info" mat-icon-button (click)="openInfo(character)">
            <mat-icon>info</mat-icon>
          </button>

          <button class="delete" mat-icon-button (click)="openDeleteCharacter(character)">
            <mat-icon>delete</mat-icon>
          </button>

        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  </div>

  <mat-paginator [pageSizeOptions]="[9, 20, 50]" showFirstLastButtons></mat-paginator>
</div>
```

#### 3.3.2 Logica del Marvel-Table

Importamos los modulos y clases necesarias para el funcionamiento del la tabla.

```typescript
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort,MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MarvelService } from '../services/marvel.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CharacterInfoComponent } from '../character-info/character-info.component';
import { CharacterDeleteComponent } from '../character-delete/character-delete.component';
import { CharacterEditComponent } from '../character-edit/character-edit.component';
import { FormsModule } from '@angular/forms';
import { MatSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marvel-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginator,
    MatSort,
    MatIcon,
    FormsModule,
    MatSpinner,
    CommonModule,
    MatSortModule
  ],
  templateUrl: './marvel-table.component.html',
  styleUrl: './marvel-table.component.css',
})
```

Instanciamos un constructor que inicializa un `MarvelService` y un `MatDialog` que nos será util mas adelante.

```typescript
export class MarvelTableComponent implements OnInit {
  displayedColumns: string[] = ["id", "name", "thumbnail", "actions"];
  dataSource = new MatTableDataSource<any>();

  isLoading: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private marvelService: MarvelService, public dialog: MatDialog) {}

```

Inicializamos la carga de los `personajes`, definimos un array que corresponderá a la cantidad de columnas que queremos mostrar en la tabla.

Implementamos a la clase `OnInit` e inicializamos su funcion que nos permite cargar los personajes llamando a una funcion definida posteriormente.

```typescript
  ngOnInit(): void {
    this.loadCharacters();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  loadCharacters(limit: number = 50, offset: number = 0) {
    this.marvelService.getCharacters(limit, offset).subscribe(
      (response) => {
        this.dataSource.data = response.data.results;
        this.dataSource.sort = this.sort;
        console.log(this.sort);
      },
      (error) => {
        console.error("Error fetching Marvel characters:", error);
      }
    );
  }
```

Definimos un `string` que nos servirá para el buscador de personajes.

```typescript
filterValue: string = "";
```

Y una función que nos permite manipular los datos con el buscador.

```typescript
    applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }
```

Ahora definimos las funciones para los botones agregados en la columna de acciones. Estos abren un dialog con su respectivo diseño y funcionalidad.

```typescript
  openInfo(character: any): void {
    this.dialog.open(CharacterInfoComponent, {
      data: character,
      width: "500px",
      height: "auto",
    });
  }

  openDeleteCharacter(character: any): void {
    const dialogRef = this.dialog.open(CharacterDeleteComponent, {
      data: { name: character.name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.dataSource.data.findIndex((c: any) => c.id === character.id);
        if (index > -1) {
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        }
      }
    });
  }

  openEditCharacter(character: any) {
    const dialogRef = this.dialog.open(CharacterEditComponent, {
      width: "250px",
      data: { ...character },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Object.assign(character, result);
        const index = this.dataSource.data.findIndex((c: any) => c.id === character.id);
        if (index > -1) {
          this.dataSource.data[index] = character;
          this.dataSource._updateChangeSubscription();
        }
      }
    });
  }
}
```

#### 3.3.3 Diseño del Marvel-Table

```css
.table-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.overlay {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.mat-elevation-z8 {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.thumbnail {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.info {
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  background-color: orange;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  color: white;
  cursor: pointer;
}

.info:hover {
  background-color: darkorange;
}

.delete {
  justify-content: center;
  align-items: center;
  background-color: red;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  margin: 0 10px;
}

.delete:hover {
  background-color: darkred;
}

.edit {
  justify-content: center;
  align-items: center;
  background-color: green;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  margin: 0 10px;
}

.edit:hover {
  background-color: darkgreen;
}

.finder {
  width: 50%;
  height: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 250px;
  letter-spacing: 2px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
}

table {
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
}

.divtabla {
  width: 100%;
  max-width: 1200px;
}

mat-paginator {
  justify-content: center;
  color: white;
  background-color: rgb(93, 93, 93);
  border-radius: 30px;
}

.background-blur {
  background-color: black;
  background-image: url("../../img/background.2.jpeg");
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

th {
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  cursor: pointer;
}

td {
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
}
```

## 4. Dialogs

### 4.1 Character-Edit

Este componente se encarga de renderizar un dialog que permite editar la informacion del personaje en cuestión.
![Creando Componente Dialog Edit](/src/img/11.png)

#### 4.1.1 Plantilla del Character-Edit

```HTML
<div class="divprincipal" [ngStyle]="{'background-image': backgroundImageURL}">
    <button class="close-button" (click)="onNoClick()">x</button>
    <h1 mat-dialog-title>Editar Personaje</h1>
    <div class="campos" mat-dialog-content>
        <mat-form-field>
            <mat-label>ID</mat-label>
            <input matInput [(ngModel)]="data.id">
        </mat-form-field>
        <mat-form-field>
            <mat-label>Nombre</mat-label>
            <input matInput [(ngModel)]="data.name">
        </mat-form-field>
        <mat-form-field>
            <mat-label>Descripción</mat-label>
            <textarea matInput [(ngModel)]="data.description"></textarea>
        </mat-form-field>
    </div>
    <div mat-dialog-actions>
        <button class="botonClose" mat-button (click)="onNoClick()">Cancelar</button>
        <button class="botonSave" (click)="onSaveClick()">Guardar</button>
    </div>
</div>
```

#### 4.1.2 Logica del Character-Edit

```typescript
import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-character-edit",
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, CommonModule, FormsModule],
  templateUrl: "./character-edit.component.html",
  styleUrl: "./character-edit.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterEditComponent {
  backgroundImageURL: string;
  constructor(public dialogRef: MatDialogRef<CharacterEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.backgroundImageURL = `url(${data.thumbnail.path}.${data.thumbnail.extension})`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.data);
  }
}
```

#### 4.1.3 Diseño del Character-Edit

```CSS
.divprincipal {
  opacity: 0.9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.divprincipal::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: inherit;
  background-size: inherit;
  background-position: inherit;
  filter: blur(10px);
  z-index: -1;
  opacity: 0.5;
}

.divprincipal::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: -1;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: white;
  margin-right: 10px;
}

.botonClose {
  background-color: rgb(122, 122, 122);
  color: white;
  text-align: center;
  font-size: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 10px 5px;
}

.botonClose:hover {
  background-color: rgb(59, 59, 59);
}

.botonSave {
  background-color: green;
  color: white;
  text-align: center;
  font-size: 16px;
  border-radius: 8px;
  padding: 10px 5px;
  margin-bottom: 20px;
  margin-right: 10px;
}

.botonSave:hover {
  background-color: darkgreen;
}

.campos {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

h1 {
  font-family: "Courier New", Courier, monospace;
  margin-top: 50px;
  font-size: 30px;
  text-align: center;
  color: white;
  font-weight: bold;
}

```

### 4.2 Character-Info

Muestra un dialog que permite visualizar informacion adicional sobre el personaje que se selecciona.

![Creando Componente Dialog Info](/src/img/12.png)

#### 4.2.1 Plantilla del Character-Info

```HTML
<div class="divprincipal" [ngStyle]="{'background-image':backgroundImageURL}">
    <button class="close-button" (click)="onNoClick()">x</button>
    <h1 class="nombre" mat-dialog-title>{{ character.name }}</h1>
    <div mat-dialog-content class="content">
        <img [src]="character.thumbnail.path + '.' + character.thumbnail.extension" alt="{{ character.name }}"
            class="thumbnail">
        <p class="descripcion">{{ character.description }}</p>
    </div>
    <div mat-dialog-actions>
        <button class="boton" (click)="onNoClick()">Cerrar</button>
    </div>
</div>
```

#### 4.2.2 Logica del Character-Info

```typescript
import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-character-info",
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, CommonModule],
  templateUrl: "./character-info.component.html",
  styleUrl: "./character-info.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterInfoComponent {
  backgroundImageURL: string;
  constructor(public dialogRef: MatDialogRef<CharacterInfoComponent>, @Inject(MAT_DIALOG_DATA) public character: any) {
    this.backgroundImageURL = `url(${character.thumbnail.path}.${character.thumbnail.extension})`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
```

#### 4.2.3 Diseño del Character-Info

```css
.divprincipal {
  opacity: 0.9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.divprincipal::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: inherit;
  background-size: inherit;
  background-position: inherit;
  filter: blur(10px);
  z-index: -1;
  opacity: 0.5;
}

.divprincipal::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: -1;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: white;
  margin-right: 10px;
}

.nombre {
  font-family: "Courier New", Courier, monospace;
  margin-top: 50px;
  font-size: 30px;
  text-align: center;
  color: white;
  font-weight: bold;
}

.thumbnail {
  margin-left: 120px;
  width: 50%;
  height: auto;
  border-radius: 8px;
}

.descripcion {
  font-family: "Courier New", Courier, monospace;
  margin-left: 50px;
  margin-right: 50px;
  font-size: 20px;
  text-align: justify;
  color: white;
  overflow: hidden;
}

.boton {
  background-color: rgb(122, 122, 122);
  color: white;
  text-align: center;
  font-size: 16px;
  border-radius: 8px;
  padding: 10px 15px;
}

.boton:hover {
  background-color: rgb(59, 59, 59);
}
```

### 4.3 Character-Delete

Abre un dialog preguntando si el usuario esta seguro de querer eliminar el personaje en cuenstión.
![Creando Componente Dialog Delete](/src/img/13.png)

#### 4.3.1 Plantilla del Character-Delete

```HTML
<div class="divprincipal">
    <button class="close-button" (click)="onNoClick()">x</button>
    <h2 mat-dialog-title>Confirmar Eliminación</h2>
    <div mat-dialog-content>
        <p>¿Estás seguro que quieres eliminar el personaje?</p>
    </div>
    <div mat-dialog-actions>
        <button class="cancel" (click)="onNoClick()">Cancelar</button>
        <button class="delete" color="warn" (click)="onYesClick()" cdkFocusInitial>Eliminar</button>
    </div>
</div>
```

#### 4.3.2 Logica del Character-Delete

```typescript
import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-character-delete",
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, CommonModule],
  templateUrl: "./character-delete.component.html",
  styleUrl: "./character-delete.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDeleteComponent {
  constructor(public dialogRef: MatDialogRef<CharacterDeleteComponent>, @Inject(MAT_DIALOG_DATA) public character: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
```

#### 4.3.3 Diseño del Character-Delete

```css
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: white;
}

.divprincipal {
  opacity: 0.9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.divprincipal::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: inherit;
  background-size: inherit;
  background-position: inherit;
  filter: blur(10px);
  z-index: -1;
  opacity: 0.5;
}

.divprincipal::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: -1;
}

h2 {
  font-family: "Courier New", Courier, monospace;
  margin-top: 50px;
  font-size: 30px;
  text-align: center;
  color: white;
  font-weight: bold;
}

p {
  font-family: "Courier New", Courier, monospace;
  font-size: 20px;
  text-align: center;
  color: white;
}

.delete {
  background-color: red;
  color: white;
  text-align: center;
  font-size: 16px;
  border-radius: 8px;
  padding: 10px 5px;
  margin-bottom: 20px;
  margin-right: 10px;
}

.delete:hover {
  background-color: darkred;
}

.cancel {
  background-color: rgb(122, 122, 122);
  color: rgb(255, 255, 255);
  text-align: center;
  font-size: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 10px 5px;
}

.cancel:hover {
  background-color: rgb(59, 59, 59);
}
```

## 5. Rutas

Definimos las rutas que utilizaremos dentro de nuestro proyecto, dentro del `app.route.ts`:

```typescript
import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component";
import { authGuard } from "./guards/auth.guard";

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [authGuard] },
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
];
```

Para proteger el contenido del Dashboard, utilizamos un `guard`:

```typescript
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.checkAuthentication()) {
    return true;
  } else {
    router.navigate(["/login"]);
    return false;
  }
};
```

## 6. Resultados

Ejecutamos nuestro proyecto: `ng serve`.

![Login](/src/img/14.png)

![Validacion de usuario que no pertenece](/src/img/15.png)

![Mostrando Menú a Usuario Validado](/src/img/16.png)

![Mostrando Componente Table](/src/img/17.png)

![Mostrando Componente Table](/src/img/18.png)

![Mostrando Componente Table](/src/img/19.png)

![Mostrando Componente Table](/src/img/20.png)

![Mostrando Componente Table](/src/img/21.png)

![Mostrando Componente Table](/src/img/22.png)

![Mostrando Componente Table](/src/img/23.png)

![Mostrando Componente Table](/src/img/24.png)

![Mostrando Componente Table](/src/img/25.png)
