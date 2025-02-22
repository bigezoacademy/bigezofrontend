import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newproduct',
  standalone: true,
  imports: [],
  templateUrl: './newproduct.component.html',
  styleUrl: './newproduct.component.css'
})
export class NewproductComponent {
  accountType:any=localStorage.getItem('accountType')||null;
  router=inject(Router);
ngOnInit() {
  if(this.accountType!='schoolAdmin'){
    this.router.navigate(['/']);
  }
}
}
