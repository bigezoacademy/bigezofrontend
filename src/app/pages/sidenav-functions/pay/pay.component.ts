import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { environment } from '../../../../../environment.prod';
import { SafeUrlPipe } from '../../../pipes/safe-url.pipe';

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [SafeUrlPipe, CommonModule, FormsModule],
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css'],
})
export class PayComponent {
  paymentDetails = {
    location: '',
  };
  studentid: number = 0;
  studentname: string = '';
  amount: number = 0;
  order_tracking_id: string = '';
  reason: string = '';
  description: string = '';
  statuscode: string = '';
  status: string = '';
  time: string = '';
  level: number = 0;
  term: string = '';
  year: number = 0;
  schooladminid: number = 0;

  // Transaction array
  transaction = [
    {
      studentid: this.studentid,
      studentname: this.studentname,
      amount: this.amount,
      order_tracking_id: this.order_tracking_id,
      reason: this.reason,
      description: this.description,
      statuscode: this.statuscode,
      status: this.status,
      time: this.time,
      level: this.level,
      term: this.term,
      year: this.year,
      schooladminid: this.schooladminid,
    }
  ];
  private router = inject(Router);
  private paymentService = inject(PaymentService);
  selectedItems: any[] = JSON.parse(
    localStorage.getItem('selectedItems') || '[]'
  );
  showIframe = false;
  iframeUrl: string = '';

 

  calculateTotal(): number {
    return this.selectedItems.reduce(
      (total, item) => total + item.unitCost * item.quantity,
      0
    );
  }

  proceedToPay() {
    console.log('Payment details:', this.paymentDetails);
    console.log('Items to pay for:', this.selectedItems);
    this.submitPayment();
  }

  goBack() {
    this.router.navigate(['/requirements']); // Adjust the route path if needed
  }

  submitPayment() {
    // Generate a random 9-digit ID
    const randomId = Math.floor(100000000 + Math.random() * 900000000).toString();
  
    const paymentBody = {
      id: randomId, // Use the randomly generated ID
      currency: 'UGX',
      amount: 500.0,
      description: 'Some random description for testing...',
      callback_url: 'http://localhost:4200/student', // Set this as needed
      notification_id: environment.notificationId, // Retrieve from environment
      billing_address: {
        email_address: 'ochalfie@gmail.com',
        phone_number: null,
        country_code: '',
        first_name: 'Alfred',
        middle_name: '',
        last_name: 'Ochola',
        line_1: '',
        line_2: '',
        city: '',
        state: '',
        postal_code: null,
        zip_code: null,
      },
    };
  
    const paymentToken = localStorage.getItem('paymentToken');
    if (!paymentToken) {
      console.error('Payment token is missing. Please request a token first.');
      return;
    }
  
    this.paymentService.submitPayment(paymentToken, paymentBody).subscribe({
      next: (response) => {
        console.log('Payment successfully submitted:', response);
        const redirectUrl = response.redirect_url;
        if (redirectUrl) {
          this.iframeUrl = redirectUrl; // Set the iframe URL
          this.showIframe = true; // Show the iframe
          console.log('Redirect URL set:', redirectUrl);
        } else {
          console.error('Redirect URL not found in the response');
        }
      },
      error: (err) => {
        console.error('Error submitting payment:', err);
        // Handle error response
      },
    });
  }
  
}
