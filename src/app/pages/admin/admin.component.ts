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

  // Student Performance Chart
  performanceChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Term 1', 'Term 2', 'Term 3'],
    datasets: [
      {
        data: [75, 80, 85],
        label: 'Student Performance (%)',
        fill: false,
        borderColor: '#3e95cd',
        backgroundColor: '#3e95cd',
        tension: 0.4,
        pointBackgroundColor: '#3e95cd',   // Point Color
        pointBorderColor: '#fff',           // White border around points
        pointRadius: 5,                     // Size of the point
        borderWidth: 2                      // Line thickness
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

  // Gender Comparison Chart
  genderChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        data: [450, 470, 500, 520, 540], // Boys data
        label: 'Boys',
        fill: false,
        borderColor: '#ff6384',
        backgroundColor: '#ff6384',
        tension: 0.3,
        pointBackgroundColor: '#ff6384',   // Point Color
        pointBorderColor: '#fff',           // White border around points
        pointRadius: 6,                     // Size of the points
        borderWidth: 2                      // Line thickness
      },
      {
        data: [430, 460, 490, 510, 530], // Girls data
        label: 'Girls',
        fill: false,
        borderColor: '#36a2eb',
        backgroundColor: '#36a2eb',
        tension: 0.3,
        pointBackgroundColor: '#36a2eb',   // Point Color
        pointBorderColor: '#fff',           // White border around points
        pointRadius: 6,                     // Size of the points
        borderWidth: 2                      // Line thickness
      }
    ]
  };

  genderChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
}
