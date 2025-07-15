import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-paymentcallback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paymentcallback.component.html',
  styleUrls: ['./paymentcallback.component.css']
})
export class PaymentCallbackComponent implements OnInit {
  @Output() closeCallback = new EventEmitter<void>();
  @Input() cancelMessage: string | null = null;
  status: 'success' | 'failed' | 'pending' | null = null;
  message: string = '';
  amount: number | null = null;
  orderTrackingId: string | null = null;
  merchantReference: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  navigateToSubscription() {
    this.closeCallback.emit();
  }

  ngOnInit(): void {
    // Example: Pesapal redirects with query params: ?orderTrackingId=xxx&merchantReference=yyy&status=success
    this.route.queryParams.subscribe(params => {
      this.orderTrackingId = params['orderTrackingId'] || null;
      this.merchantReference = params['merchantReference'] || null;
      this.status = params['status'] || null;
      // Optionally fetch more details from backend
      if (this.orderTrackingId && this.merchantReference) {
        this.fetchPaymentStatus();
      } else {
        this.status = 'failed';
        this.message = 'Payment details missing.';
      }
    });
  }

  fetchPaymentStatus() {
    // Replace with your backend endpoint for payment status
    this.http.get<any>(`http://localhost:8080/api/subscriptions/payment-status?orderTrackingId=${this.orderTrackingId}&merchantReference=${this.merchantReference}`)
      .subscribe({
        next: (data) => {
          this.status = data.status || 'pending';
          this.amount = data.amount || null;
          this.message = data.message || (this.status === 'success' ? 'Payment successful!' : 'Payment failed.');
        },
        error: () => {
          this.status = 'failed';
          this.message = 'Could not verify payment status.';
        }
      });
  }
}
