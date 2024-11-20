import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { UserTableComponent } from "./users-table/users-table.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, DashboardComponent, CommonModule, UserTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Login_Angular_HRKE';
  isLoggedIn = false;
  userName:string = '';
  userAvatar:string = '';
  
  onLoginSuccess(event:{userName:string, avatar:string}) {
    this.isLoggedIn = true;
    this.userName = event.userName;
    this.userAvatar = event.avatar;
  }

  get showDashboard() {
    return this.isLoggedIn;
  }
}
