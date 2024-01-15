// app/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  handleLogin(): void {
    this.error = '';
    this.loading = true;

    const loginData = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>('http://localhost:8080/api/auth/signin', loginData)
      .subscribe(
        response => {
          const token = response.accessToken;
          localStorage.setItem('jwtToken', token);

          const employeeId = response.id;
          localStorage.setItem('employeeId', employeeId.toString());
          console.log('Stored Employee ID:', employeeId);

          const roles = response.roles;
          localStorage.setItem('userRoles', JSON.stringify(roles));

          this.router.navigate(['mainindex']);
        },
        error => {
          this.error = 'Invalid credentials. Please try again.';
          this.loading = false;
        }
      );
  }
}
