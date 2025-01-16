
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css'],
})
export class PayComponent {
  paymentDetails = {
    location: '',
  };
  selectedItems: any[] = JSON.parse(localStorage.getItem('selectedItems') || '[]');

  calculateTotal(): number {
    return this.selectedItems.reduce((total, item) => total + item.unitCost * item.quantity, 0);
  }

  proceedToPay() {
    console.log('Payment details:', this.paymentDetails);
    console.log('Items to pay for:', this.selectedItems);
    // Implement actual payment logic here
  }
}

