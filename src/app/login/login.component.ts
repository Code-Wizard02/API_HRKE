import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {AuthService} from '../services/auth.service';

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
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();
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
          this.loginSuccess.emit();
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

