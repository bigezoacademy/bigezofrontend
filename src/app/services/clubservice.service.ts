import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClubserviceService {

  private apiUrl = 'https://your-api-url.com/clubs'; // Replace with your actual URL

  constructor(private http: HttpClient) { }

  // Method to fetch club data from API
  getClubs(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
