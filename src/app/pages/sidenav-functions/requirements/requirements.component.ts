import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-requirements',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css']
})
export class RequirementsComponent {
  requirementsUrl: string = 'http://localhost:8080/api/requirements';
  requirements: any[] = []; // To store fetched requirements
  myyear: number = 2025;  // Default year as number
  mylevel: string = '5';  // Default level as string
  myterm: number = 1;     // Default term as number

  // Define the possible values for year, term, and level
  years: number[] = [2025, 2026, 2027];  // Example years
  terms: number[] = [1, 2];              // Example terms
  levels: string[] = ['1', '2', '3', '4', '5','6','7']; // Example levels

  private http = inject(HttpClient);

  // This method will be called when the "Show All" button is clicked
  showrequirements() {
    // Fetch requirements based on the predefined parameters (myyear, mylevel, myterm)
    this.http
      .get<any[]>(this.requirementsUrl, {
        params: {
          year: this.myyear.toString(),  // Convert number to string for URL query
          level: this.mylevel,
          term: this.myterm.toString(),   // Convert number to string for URL query
        },
      })
      .subscribe({
        next: (data) => {
          this.requirements = data;
        },
        error: (err) => {
          console.error('Error fetching requirements', err);
        },
      });
  }
}
