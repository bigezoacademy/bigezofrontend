import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';

@Component({
  selector: 'app-payment-callback',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './payment-callback.component.html',
  styleUrl: './payment-callback.component.css'
})
export class PaymentCallbackComponent implements OnChanges {
 @Input() redirectUrl!: string;

 ngOnChanges(changes: SimpleChanges): void {
  console.log('Payment Iframe URL:', changes['redirectUrl'].currentValue);
   if (changes['redirectUrl'] && changes['redirectUrl'].currentValue) {
     console.log('Payment Iframe URL:', changes['redirectUrl'].currentValue);
   }
 }
}
