import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from '../../subscription/subscription.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgChartsModule, CommonModule, SubscriptionComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  userId: any = localStorage.getItem("id");
  subscriptionStatus: 'free' | 'standard' | 'premium' = 'free';
  isAnalyticsEnabled: boolean = false;

  // 🎯 Student Performance Chart
  performanceChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['2023', '2024', '2025'],
    datasets: [
      {
        data: [730, 1800, 2675],
        label: 'Students Enrolled',
        fill: false,
        borderColor: '#389b3e',
        backgroundColor: '#389b3e',
        tension: 0.4,
        pointBackgroundColor: '#389b3e',
        pointBorderColor: '#fff',
        pointRadius: 5,
        borderWidth: 2
      }
    ]
  };

  performanceChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Student Enrollment Statistics' // 📢 Added Title
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // 📊 Boys vs Girls Chart Data
  genderChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        data: [450, 770, 500, 820, 1540], // Boys data
        label: 'Boys',
        fill: false,
        borderColor: '#2f2f2f',          // 💙 Brighter Blue for contrast
        backgroundColor: 'transparent',
        tension: 0.4,
        pointBackgroundColor: '#2f2f2f',
        pointBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 10,
        borderWidth: 2,
        pointStyle: 'triangle'           // 🔺 Triangle points
      },
      {
        data: [220, 460, 390, 510, 890], // Girls data
        label: 'Girls',
        fill: false,
        borderColor: '#de1e96',          // 💖 Light Pink
        backgroundColor: 'transparent',
        tension: 0.4,
        pointBackgroundColor: '#de1e96',
        pointBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 10,
        borderWidth: 2,
        pointStyle: 'rectRounded'        // 🔳 Rounded rectangle points
      }
    ]
  };

  // ⚙️ Boys vs Girls Chart Options
  genderChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Gender Comparison: Boys vs Girls (2019–2023)' // 📢 Added Title
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => ` ${tooltipItem.dataset.label}: ${tooltipItem.raw}` // ✨ Custom Tooltip Format
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  @ViewChild(BaseChartDirective) performanceChart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) genderChart: BaseChartDirective | undefined;


// Add this method to your component class


constructor(private http: HttpClient) {}

ngOnInit(): void {
  this.checkSubscriptionStatus();
}

checkSubscriptionStatus() {
  // Replace with your actual backend endpoint
  this.http.get<{status: 'free' | 'standard' | 'premium'}>(`/api/subscriptions/status?userId=${this.userId}`).subscribe({
    next: (res) => {
      this.subscriptionStatus = res.status;
      this.isAnalyticsEnabled = (res.status === 'standard' || res.status === 'premium');
    },
    error: () => {
      this.subscriptionStatus = 'free';
      this.isAnalyticsEnabled = false;
    }
  });
}

downloadChart(chart: BaseChartDirective | undefined, chartName: string) {
  if (chart && chart.chart) {
    const link = document.createElement('a');
    link.href = chart.chart.toBase64Image();
    link.download = `${chartName}-chart.png`;
    link.click();
  }
}

}
