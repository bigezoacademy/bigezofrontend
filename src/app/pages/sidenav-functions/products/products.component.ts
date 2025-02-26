import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var $: any;  // Enable jQuery

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  products: any[] = [
    { image: 'pen.png', name: 'Graphic Pen', price: 5000 },
    { image: 'book.png', name: 'Notebook', price: 15000 },
    { image: 'desktop.png', name: 'PC Desktop', price: 55000 },
    { image: 'bag.png', name: 'Back Pack', price: 25000 }
  ];
  showCart: boolean = false;

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: true,
        responsive: {
          0: { items: 1, stagePadding: 20 },
          600: { items: 2, margin: 15 },
          1000: { items: 3 }
        }
      });
    }, 100);
  }
}
