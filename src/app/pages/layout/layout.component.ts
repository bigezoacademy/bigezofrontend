import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  constructor(private router:Router){

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
