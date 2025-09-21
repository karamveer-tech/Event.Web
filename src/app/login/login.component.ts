import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CONFIG } from '../confiq/confiq';

interface LoginRequest {
  email: string;
  password_hash: string;
}

interface LoginResponseData {
  token: string;
  role_name: string;
  id: number;
}

interface LoginResponse {
  data: LoginResponseData;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class LoginComponent  implements OnInit {
  loginModel: LoginRequest = {
    email: '',
    password_hash: ''
  };
  remember: boolean = false;

  constructor() { }

  ngOnInit() {}
async onSubmit() {
  
    if (!this.loginModel.email || !this.loginModel.password_hash) {
      alert('Please fill in both email and password.');
      return;
    }

    const apiUrl = `${CONFIG.API_BASE_URL}/api/Auth/login`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.loginModel)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      const email = this.loginModel.email;
      if (data.data.token) {
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('role', data.data.role_name);
        localStorage.setItem('username', email);
        localStorage.setItem('userId', data.data.id.toString());
      }

      const redirect_url = localStorage.getItem('redirect_url');

      if (redirect_url && redirect_url !== '') {
        window.location.href = redirect_url;
      } else if (data.data.role_name === 'admin') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/home';
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred during login.');
    }
  }
}
