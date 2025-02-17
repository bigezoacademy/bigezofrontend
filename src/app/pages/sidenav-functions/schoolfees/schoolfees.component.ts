import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schoolfees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schoolfees.component.html',
  styleUrls: ['./schoolfees.component.css']
})
export class SchoolfeesComponent {
  myyear: number = new Date().getFullYear();
  mylevel: string = '5';
  years: number[] = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  enrollmentStatuses: string[] = ['active', 'alumni', 'inactive'];
  levels: string[] = ['1', '2', '3', '4', '5', '6', '7'];
}
