import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { MarvelTableComponent } from "./marvel-table/marvel-table.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, DashboardComponent, CommonModule, MarvelTableComponent],
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
