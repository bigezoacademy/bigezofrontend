
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  constructor(private router:Router,private renderer: Renderer2){

  }
accounttype:any=localStorage.getItem("Role");

ngOnInit(): void {
  const script = this.renderer.createElement('script');
  script.src = 'src/index.js';
  script.onload = () => {
    console.log('index.js loaded');
  };
  this.renderer.appendChild(document.body, script);
}
  terms():any{
this.router.navigateByUrl("terms");
  }

  logout():any{
    // Clear the local storage
    localStorage.clear();

    // Optionally clear session storage if used
    sessionStorage.clear();

    // Navigate to the home or login page
    this.router.navigateByUrl("");
  }



  
}



