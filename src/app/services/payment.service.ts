import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:8080/api/pesapal/request-token';

  constructor(private http: HttpClient) {}

  requestPaymentToken(): Observable<any> {
    // Set the API key in the headers
    const headers = new HttpHeaders().set('X-API-KEY', 'ThisIsMyPesapalApiKey'); // Replace 'your-api-key' with your actual API key

    return this.http.post(this.apiUrl, {}, { headers });
  }
}
