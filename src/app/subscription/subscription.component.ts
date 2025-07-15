import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeUrlPipe],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent {
  subscriptionTier: string = 'free';
  studentCount: number = 1;
  isSubscribing: boolean = false;
  subscriptionStatus: string | null = null;
  paymentIframeUrl: string | null = null;

  constructor(private http: HttpClient) {}

  subscribeToPaidPlan(tier: string) {
    if (!tier || !this.studentCount) return;
    this.isSubscribing = true;
    this.subscriptionStatus = null;
    const schoolAdminId = localStorage.getItem('id') || '1';
    const numberOfStudents = this.studentCount;
    let params = new HttpParams();
    params = params.append('schoolAdminId', schoolAdminId);
    params = params.append('numberOfStudents', numberOfStudents.toString());
    params = params.append('tierName', tier);
    this.http.post('http://localhost:8080/api/subscriptions/paid', null, {
      params: params,
      responseType: 'text'
    }).subscribe({
      next: (paymentUrl: string) => {
        this.isSubscribing = false;
        if (paymentUrl) {
          this.paymentIframeUrl = paymentUrl;
        }
      },
      error: (error: any) => {
        this.isSubscribing = false;
        console.error('Subscription initiation failed:', error);
        alert('Failed to initiate subscription. Please try again.');
      }
    });
  }
}
