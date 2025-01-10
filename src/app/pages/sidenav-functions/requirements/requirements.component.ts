import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-requirements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css']
})
export class RequirementsComponent {
  requirementsUrl: string = 'http://localhost:8080/api/requirements';
  requirements: any[] = []; // To store fetched requirements
  myyear: number = 2025;  // Default year as number
  mylevel: string = '7';  // Default level as string
  myterm: number = 1;     // Default term as number

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
