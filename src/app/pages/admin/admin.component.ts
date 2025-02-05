import { Component } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  userId: any = localStorage.getItem("id");

  // Chart Data
  performanceChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Term 1', 'Term 2', 'Term 3', 'Term 4'],
    datasets: [
      {
        data: [75, 80, 85, 90], // Example student performance data
        label: 'Student Performance (%)',
        fill: true,
        borderColor: '#3e95cd',
        backgroundColor: 'rgba(62, 149, 205, 0.4)',
        tension: 0.4
      }
    ]
  };

  performanceChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };
}
