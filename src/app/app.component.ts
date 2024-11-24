import { Component, OnInit } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { MarvelTableComponent } from './marvel-table/marvel-table.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LoginComponent,
    DashboardComponent,
    CommonModule,
    MarvelTableComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Login_Angular_HRKE';
  isLoggedIn: boolean = false;
  userName: string = '';
  userAvatar: string = '';
  
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.isLoggedIn = this.authService.checkAuthentication();
    if (this.isLoggedIn) {
      this.userName = this.authService.getUserName();
      this.userAvatar = this.authService.getAvatar();
    }
  }

  onLoginSuccess(event: { userName: string; avatar: string }) {
    this.isLoggedIn = true;
    this.userName = event.userName;
    this.userAvatar = event.avatar;
  }

  logout():void {
    this.authService.logout();
    this.isLoggedIn=false;
  }

  get showDashboard() {
    return this.isLoggedIn;
  }
}
