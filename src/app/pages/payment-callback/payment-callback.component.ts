import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
  selector: 'app-payment-callback',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  template: `
    <div class="payment-callback-container">
      <h2>Payment Callback</h2>
      <ng-container *ngIf="redirectUrl; else doneMsg">
        <iframe [src]="redirectUrl | safeUrl" width="100%" height="600" frameborder="0" allowfullscreen></iframe>
      </ng-container>
      <ng-template #doneMsg>
        <p>Your payment process has returned to this page. You may close this window or return to the application.</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .payment-callback-container {
      max-width: 500px;
      margin: 40px auto;
      padding: 32px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      text-align: center;
    }
    h2 { color: #2e7d32; }
  `]
})
export class PaymentCallbackComponent {
  @Input() redirectUrl: string | null = null;
}
