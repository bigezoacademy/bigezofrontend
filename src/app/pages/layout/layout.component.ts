
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  sidebarVisible: boolean = false;

  constructor(private router: Router, private renderer: Renderer2) {}

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
accounttype:any=localStorage.getItem("Role");

ngOnInit(): void {

}
  terms():any{
this.router.navigateByUrl("terms");
  }
  home():any{
    this.router.navigateByUrl("admin");
      }
  requirements():any{
    this.router.navigateByUrl("requirements");
      }
      newrequirement():any{
        this.router.navigateByUrl("newrequirement");
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



