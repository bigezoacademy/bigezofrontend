import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-callback.component.html',
  styleUrl: './payment-callback.component.css'
})
export class PaymentCallbackComponent {
 @Input() redirectUrl!: string;
}
