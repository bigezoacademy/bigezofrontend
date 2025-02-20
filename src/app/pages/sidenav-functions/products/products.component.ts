import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products: any[] = [
    { image: 'pen.png', name: 'Graphic Pen', price: 5000 },
    { image: 'book.png', name: 'Notebook', price: 15000 },
    { image: 'desktop.png', name: 'PC Desktop', price: 55000 },
    { image: 'bag.png', name: 'Back Pack', price: 25000 }
  ];
}
