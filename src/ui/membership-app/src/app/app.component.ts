import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UserListComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Membership App';
  isLoggedIn = false;
  loginError = '';
  username = '';
  password = '';

  currentDateTime: string = '';

  constructor() {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
  }

  updateDateTime() {
    const now = new Date();
    this.currentDateTime = now.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  login() {
    if (this.username === 'admin' && this.password === 'admin2016') {
      this.isLoggedIn = true;
      this.loginError = '';
      this.username = '';
      this.password = '';
    } else {
      this.loginError = 'Invalid username or password';
    }
  }

  logout() {
    this.isLoggedIn = false;
  }
}
