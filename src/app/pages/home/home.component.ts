import { Component } from '@angular/core';
import { RegisterComponent } from "../../register/register.component";
import { CommonModule } from '@angular/common';
import { LoginComponent } from "../../login/login.component";
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',  
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [RegisterComponent, CommonModule, LoginComponent, HttpClientModule],
})
export class HomeComponent {
  showLogin: boolean = true;

  toggleView() {
    this.showLogin = !this.showLogin;
  }

    constructor(private router:Router){
  
    }
    contact():any{
  this.router.navigateByUrl("terms");
    }
}
