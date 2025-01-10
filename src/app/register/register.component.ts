import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


interface RegisterResponse {
  success: boolean;
  message?: string;
  data?: any;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  private readonly registerUrl = 'http://localhost:8080/auth/registerschool';

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.registerForm = this.formBuilder.group({
      schoolName: ['', [Validators.required]],
      adminUsername: ['', [Validators.required]],  // This was the original "adminUsername"
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      district: ['', [Validators.required]],
    });
  }

 /*  onSubmit() {
    // Check if the form is valid
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }
  
  
    this.successMessage = '';
    this.errorMessage = '';
  

    const formData = {
      schoolName: this.registerForm.get('schoolName')?.value,
      adminUsername: this.registerForm.get('adminUsername')?.value,  
      adminPassword: this.registerForm.get('password')?.value,
      adminPhone: this.registerForm.get('phone')?.value,
      adminEmail: this.registerForm.get('email')?.value,
      district: this.registerForm.get('district')?.value,
    };
  
  
    this.http.post<RegisterResponse>(this.registerUrl, formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Registration successful!';
          this.registerForm.reset();
        } else {
          this.errorMessage = response.message || 'Registration failed. Please try again later.';
        }
      },
      error: (error) => {
        this.errorMessage = 'Registration failed. Please try again later.';
        console.error('Error:', error);
      },
    });
  } */

    onSubmit() {
      // Check if the form is valid
      if (this.registerForm.invalid) {
        this.errorMessage = 'Please fill out all required fields correctly.';
        return;
      }
    
      this.successMessage = '';
      this.errorMessage = '';
    
      const formData = {
        schoolName: this.registerForm.get('schoolName')?.value,
        adminUsername: this.registerForm.get('adminUsername')?.value,  
        adminPassword: this.registerForm.get('password')?.value,
        adminPhone: this.registerForm.get('phone')?.value,
        adminEmail: this.registerForm.get('email')?.value,
        district: this.registerForm.get('district')?.value,
      };
    
      this.http.post<RegisterResponse>(this.registerUrl, formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Registration successful!';
            this.registerForm.reset();
          } else {
            this.errorMessage = response.message || 'Registration failed. Please try again later.';
          }
        },
        error: (error) => {
          if (error.status === 400 && error.error?.message === 'Admin username already exists') {
            this.errorMessage = 'The username is already taken. Please choose a different one.';
          } else {
            this.errorMessage = 'Registration failed. Please try again later.';
          }
          console.error('Error:', error);
        },
      });
    }
    

  }
