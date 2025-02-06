import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-general-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './general-layout.component.html',
  styleUrl: './general-layout.component.css'
})
export class GeneralLayoutComponent {
  constructor(private router:Router){

  }
  contact():any{
this.router.navigateByUrl("contact");
  }

  login():any{
       this.router.navigateByUrl("");
  }
}
