import { Component } from '@angular/core';

@Component({
  selector: 'app-progress-indicator',
  standalone: true,
  template: `
    <div class="progress-indicator-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Processing...</span>
      </div>
      <div class="mt-2">Processing your payment, please wait...</div>
    </div>
  `,
  styles: [`
    .progress-indicator-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 120px;
      margin: 24px 0;
    }
    .spinner-border {
      width: 3rem;
      height: 3rem;
    }
  `]
})
export class ProgressIndicatorComponent {}
