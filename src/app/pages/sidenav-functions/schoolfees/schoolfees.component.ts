import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schoolfees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schoolfees.component.html',
  styleUrls: ['./schoolfees.component.css']
})
export class SchoolfeesComponent implements OnInit {
  myyear: number = new Date().getFullYear();
  mylevel: string = '5';
  schooladmin: string = 'admin123';
  years: number[] = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  levels: string[] = ['1', '2', '3', '4', '5', '6', '7'];
  fees: any[] = []; // Stores fetched fee amounts

  constructor() {}

  ngOnInit(): void {
    // Fetch initial data if needed
  }

  displayAmounts(): void {
    // Dummy data
    this.fees = [
      { description: 'Tuition', amount: 800000 },
      { description: 'Library Fee', amount: 50000 },
      { description: 'Exam Fee', amount: 100000 }
    ];
    console.log('Selected Year:', this.myyear);
    console.log('Selected Level:', this.mylevel);
    console.log('School Admin:', this.schooladmin);
  }
  getTotalAmount(): number {
    return this.fees.reduce((sum, fee) => sum + fee.amount, 0);
  }
}
