// src/app/login/login.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from 'express';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Console } from 'node:console';

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

constructor(private http:HttpClient){}


  onSubmit(loginForm: NgForm) {
    this.apiLoginObj={
      "username":this.username,
      "password":this.password
    }
    console.log(`BEFORE SENDING CREDENTIALS ------------${this.apiLoginObj.username}`);
    // Prevent form submission if invalid
    //debugger;
   // if (loginForm.invalid) return;
   
      this.http.post("http://localhost:8080/auth/login",this.apiLoginObj).subscribe((res:any)=>{
      //debugger;
      console.log(`TOKEN ------------${res}`);
      alert(`SUCCESSFULLY LOGGED IN. TOKEN ------------${res.data}`)

localStorage.setItem("Returned data ---------",res.data);
localStorage.setItem("Token: ",res.data);
      },error=>{
        alert(`UNAUTHORIZED ACCESS FOR ------------${this.apiLoginObj.username}`)
      })
     }
 
  
}
