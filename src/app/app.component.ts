import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, DashboardComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Login_Angular_HRKE';
  isLoggedIn = false;
  userName:string = '';
  
  onLoginSuccess(userName:string) {
    this.isLoggedIn = true;
    this.userName = userName;
  }

  get showDashboard() {
    return this.isLoggedIn;
  }
}
