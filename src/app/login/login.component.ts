// src/app/login/login.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Console } from 'node:console';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class LoginComponent {
  
 role:string =""; 
 userId:string = "";
  username: string = '';
  password: string = '';
  studentNumber: string = '';  // Used for the student login form
  userType: string = ''; // Holds 'schoolAdmin' or 'student'
  errorMessage: string = '';  // To show error message

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(loginForm: NgForm) {
    let loginUrl = '';
    let loginObj: any = {};

    // Check if userType is selected
    if (!this.userType) {
      this.errorMessage = 'Please select a user type.';
      return;
    }

    // Handle login for student
    if (this.userType === 'student') {
     // localStorage.setItem('Role', "ROLE_USER");
      loginUrl = 'http://localhost:8080/auth/student-login';
      loginObj = {
        studentNumber: this.username, // Use studentNumber for student login
        password: this.password
      };
     
    } 
    // Handle login for school admin (default)
    else if (this.userType === 'schoolAdmin') {
      if (!this.username) {
        this.errorMessage = 'Username is required.';
        return;
      }
      loginUrl = 'http://localhost:8080/auth/login';
      loginObj = {
        username: this.username,
        password: this.password
      };
    }

    // Send the login request based on userType
    this.http.post(loginUrl, loginObj).subscribe(
      (res: any) => {
        const token = res.data.token; 
       
        if (this.userType === 'student'){          
         this.userId=res.data.studentId;
         this.role="ROLE_USER";
         localStorage.setItem('Token', token);
         localStorage.setItem('id', this.userId);
         localStorage.setItem('Role', this.role);
        }
        else{
         this.userId = res.data.userId;
      this.role=res.data.role;
      localStorage.setItem('Token', token);
      localStorage.setItem('id', this.userId);
      localStorage.setItem('Role', this.role);
        }
       
       

        // Redirect based on this.role
        if (this.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin']);
        } else if (this.role === 'ROLE_USER') {
          alert('LOGGED IN AS STUDENT');
          this.router.navigate(['/student']);
        } else if (this.role === 'ROLE_TEACHER') {
          alert('LOGGED IN AS TEACHER');
        } else if (this.role === 'ROLE_SUPPLIER') {
          alert('LOGGED IN AS SUPPLIER');
        } else if (this.role === 'ROLE_BIGEZOADMIN') {
          alert('LOGGED IN AS BIGEZO ADMIN');
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
