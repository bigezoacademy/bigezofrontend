// src/app/login/login.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';  // To show error message
  apiLoginObj:any={
    "username":"",
    "password":""
  }

constructor(private http:HttpClient, private router:Router){}


onSubmit(loginForm: NgForm) {
  this.apiLoginObj = {
    username: this.username,
    password: this.password,
  };

  this.http.post('http://localhost:8080/auth/login', this.apiLoginObj).subscribe(
    (res: any) => {
      const token = res.data.token;
      const role = res.data.role;  // Assuming the backend sends the role
      const userId = res.data.userId;
      localStorage.setItem('Token', token);
      localStorage.setItem('Role', role);
      localStorage.setItem('id', userId);

      if (role === 'ROLE_ADMIN') {
        this.router.navigate(['/admin']);
      } else if (role === 'ROLE_USER') {
        this.router.navigate(['/student']);
      } else if (role === 'ROLE_TEACHER') {
        alert('LOGGED IN AS TEACHER');
       // this.router.navigate(['']);
      } else if (role === 'ROLE_SUPPLIER') {
        alert('LOGGED IN AS SUPPLIER');
       // this.router.navigate(['']);
      } else if (role === 'ROLE_BIGEZOADMIN') {
        alert('LOGGED IN AS BIGEZO ADMIN');
        //this.router.navigate(['']);
      } else {
        alert('UNKNOWN ROLE!');
      }
    },
    (error) => {
      alert('UNAUTHORIZED ACCESS!');
    }
  );
}


 
  
}
