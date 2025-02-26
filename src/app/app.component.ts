import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {  HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, HttpClientModule],  // Import HttpClientModule
  providers: [
  
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'bigezo-frontend';
  showcart:boolean= true;
  constructor(private router:Router){

  }
  contact():any{
this.router.navigateByUrl("terms");
  }
ngOnInit(): void {

}

}
