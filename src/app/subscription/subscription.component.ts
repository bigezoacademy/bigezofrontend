import { Component, OnInit } from '@angular/core';
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
export class SubscriptionComponent implements OnInit {
  pricingList: any[] = [];
  readonly freeTier = { tier: 'free', costPerStudent: 0 };
  openSpinnerModal(tier: string) {
    // Show Bootstrap modal
    const modal = document.getElementById('spinnerModal');
    if (modal) {
      // Bootstrap 5 modal API
      // @ts-ignore
      const bsModal = new (window as any).bootstrap.Modal(modal);
      bsModal.show();
    }
    this.subscribeToPaidPlan(tier);
  }
  subscriptionTier: string = 'free';
  studentCount: { [key: string]: number } = { standard: 1, premium: 1 };
  isSubscribing: { [key: string]: boolean } = { standard: false, premium: false };
  subscriptionStatus: string | null = null;
  paymentIframeUrl: string | null = null;
  pricing: any = {};
  pricingError: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPricing();
  }

  fetchPricing() {
    this.http.get<any[]>('http://localhost:8080/api/pricing').subscribe({
      next: (data) => {
        console.log('Pricing API response:', data);
        this.pricing = {};
        // Parse features JSON for each package
        const parsedPaidTiers = (data || []).map(pkg => {
          if (pkg.features) {
            try {
              // Remove control characters and newlines before parsing
              const sanitized = pkg.features.replace(/[\r\n\t\f\v]/g, '').replace(/\s+/g, ' ');
              pkg.parsedFeatures = JSON.parse(sanitized);
            } catch (e) {
              console.error('Error parsing features JSON:', e);
              pkg.parsedFeatures = [];
            }
          } else {
            pkg.parsedFeatures = [];
          }
          return pkg;
        });
        // Always include the Free card at the start, then sort others by costPerStudent ascending
        const paidTiers = parsedPaidTiers.slice().sort((a, b) => a.costPerStudent - b.costPerStudent);
        this.pricingList = [this.freeTier, ...paidTiers];
        if (!data || data.length === 0) {
          this.pricingError = 'Pricing data unavailable.';
        } else {
          data.forEach(pkg => {
            this.pricing[pkg.tier] = pkg.costPerStudent;
          });
          this.pricingError = null;
        }
      },
      error: (err) => {
        this.pricingError = 'Failed to fetch pricing.';
        console.error('Failed to fetch pricing:', err);
      }
    });
  }

  getCalculatedPrice(tier: string): number {
    // Find the correct package from pricingList
    const pkg = this.pricingList.find(p => p.tier === tier);
    const costPerStudent = pkg && pkg.costPerStudent ? Number(pkg.costPerStudent) : 0;
    const count = this.studentCount[tier] || 1;
    const total = costPerStudent * count;
    console.log(`Tier: ${tier}, CostPerStudent: ${costPerStudent}, Count: ${count}, Total: ${total}`);
    return total;
  }

  capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  subscribeToPaidPlan(tier: string) {
    if (!tier || !this.studentCount[tier]) return;
    this.isSubscribing[tier] = true;
    this.subscriptionStatus = null;
    const schoolAdminId = localStorage.getItem('id') || '1';
    const numberOfStudents = this.studentCount[tier];
    // Find the correct tierName from pricing API data
    let tierName = tier;
    if (this.pricing && typeof this.pricing === 'object') {
      // Try to find the tierName from the pricing API response
      // If you want to use the backend's tierName, you may need to store the full pricing array
      // For now, we assume the key matches the backend's tierName
      tierName = tier;
    }
    let params = new HttpParams();
    params = params.append('schoolAdminId', schoolAdminId);
    params = params.append('numberOfStudents', numberOfStudents.toString());
    params = params.append('tierName', tierName);
    this.http.post('http://localhost:8080/api/subscriptions/paid', null, {
      params: params,
      responseType: 'text'
    }).subscribe({
      next: (paymentUrl: string) => {
        this.isSubscribing[tier] = false;
        if (paymentUrl) {
          this.paymentIframeUrl = paymentUrl;
          // Hide spinner modal when iframe loads
          const modal = document.getElementById('spinnerModal');
          if (modal) {
            // @ts-ignore
            const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
            if (bsModal) bsModal.hide();
          }
        }
      },
      error: (error: any) => {
        this.isSubscribing[tier] = false;
        console.error('Subscription initiation failed:', error);
        alert('Failed to initiate subscription. Please try again.');
      }
    });
  }
}
