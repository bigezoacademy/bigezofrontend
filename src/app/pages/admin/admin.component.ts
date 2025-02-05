import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { Chart, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  userId: any = localStorage.getItem("id");

  // 🎯 Student Performance Chart
  performanceChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Term 1', 'Term 2', 'Term 3'],
    datasets: [
      {
        data: [1230, 1800, 2675],
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
        text: 'Student Enrollment Performance' // 📢 Added Title
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
        data: [450, 470, 500, 520, 540], // Boys data
        label: 'Boys',
        fill: false,
        borderColor: '#2f2f2f',          // 💙 Brighter Blue for contrast
        backgroundColor: '#2f2f2f',
        tension: 0.4,
        pointBackgroundColor: '#2f2f2f',
        pointBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 10,
        borderWidth: 2,
        pointStyle: 'triangle'           // 🔺 Triangle points
      },
      {
        data: [430, 460, 490, 510, 530], // Girls data
        label: 'Girls',
        fill: false,
        borderColor: '#de1e96',          // 💖 Light Pink
        backgroundColor: '#de1e96',
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
}
