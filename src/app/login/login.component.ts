// src/app/login/login.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Console } from 'node:console';
import swal from 'sweetalert2';

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
  isLoading: boolean = false; // To show loading state

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
      //loginUrl = 'https://bigezo-production.up.railway.app/auth/student-login';
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
      //loginUrl = 'https://bigezo-production.up.railway.app/auth/login';
      loginUrl = 'http://localhost:8080/auth/login';
      loginObj = {
        username: this.username,
        password: this.password
      };
    }

    this.isLoading = true; // Set loading to true before the request
    // Send the login request based on userType
    this.http.post(loginUrl, loginObj).subscribe(
      (res: any) => {
        const token = res.data.token; 
       
        if (this.userType === 'student'){          
         this.userId=res.data.studentId;
         const schoolAdminId = res.data.schoolAdminId; 
         const firstName=res.data.firstName;
         const lastName=res.data.lastName;
         this.role="ROLE_USER";
         if (typeof window !== 'undefined' && window.localStorage) {
           window.localStorage.setItem('Token', token);
           window.localStorage.setItem('id', this.userId);
           window.localStorage.setItem('Role', this.role);
           window.localStorage.setItem('schoolAdminId', schoolAdminId.toString()); 
           window.localStorage.setItem('firstName',firstName);
           window.localStorage.setItem('lastName',lastName);
           window.localStorage.setItem('level',res.data.level);
           window.localStorage.setItem('showcart','true');
         }
        }
        else{
         this.userId = res.data.userId;
      this.role=res.data.role;
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('Token', token);
        window.localStorage.setItem('id', this.userId);
        window.localStorage.setItem('Role', this.role);
      }
        }
       
       

        // Redirect based on this.role
        if (this.role === 'ROLE_ADMIN') {
          swal.fire('Success', 'LOGGED IN AS ADMIN', 'success');
          this.router.navigate(['/admin']);
        } else if (this.role === 'ROLE_USER') {
          swal.fire('Success', 'LOGGED IN AS STUDENT', 'success');
          this.router.navigate(['/student']);
        } else if (this.role === 'ROLE_TEACHER') {
          swal.fire('Success', 'LOGGED IN AS TEACHER', 'success');
        } else if (this.role === 'ROLE_SUPPLIER') {
          swal.fire('Success', 'LOGGED IN AS SUPPLIER', 'success');
        } else if (this.role === 'ROLE_BIGEZOADMIN') {
          swal.fire('Success', 'LOGGED IN AS BIGEZO ADMIN', 'success');
        } else {
          swal.fire('Error', 'UNKNOWN ROLE', 'error');
        }
        this.isLoading = false; // Reset loading state on success
      },
      (error) => {
        this.isLoading = false; // Reset loading state on error
        swal.fire('Error', 'UNAUTHORIZED ACCESS!', 'error');
      }
    );
  }
}
