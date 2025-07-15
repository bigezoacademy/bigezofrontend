import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubscriptionStatusService {
  private statusSubject = new BehaviorSubject<string | null>(localStorage.getItem('subscriptionStatus'));
  status$ = this.statusSubject.asObservable();

  setStatus(status: string | null) {
    localStorage.setItem('subscriptionStatus', status || '');
    this.statusSubject.next(status);
  }

  getStatus(): string | null {
    return this.statusSubject.value;
  }

  setPaymentInProgress(inProgress: boolean) {
    if (inProgress) {
      localStorage.setItem('paymentIframeUrl', 'inProgress');
    } else {
      localStorage.removeItem('paymentIframeUrl');
    }
  }

  getPaymentInProgress(): boolean {
    return !!localStorage.getItem('paymentIframeUrl');
  }
}
