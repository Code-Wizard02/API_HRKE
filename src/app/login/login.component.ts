import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';

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
export class LoginComponent {
  user: string = '';
  password: string = '';
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
          this.router.navigate(['/dashboard']);
        } else {
          this.loginValid = false;
        }
      },
      (error) => {
        console.log('Login error:', error);
        this.loginValid = false;
      }
    );
  }
}
