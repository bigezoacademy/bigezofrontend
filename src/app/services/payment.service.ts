import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private requestTokenUrl = 'http://localhost:8080/api/pesapal/request-token';
  private submitOrderUrl = 'https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest';
  private getTransactionUrl = 'https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus?orderTrackingId=';

  private netlifyProxyUrl = '/.netlify/functions/cors-proxy'; // Netlify function proxy URL

  constructor(private http: HttpClient) {}

  requestPaymentToken(): Observable<any> {
    const headers = new HttpHeaders().set('X-API-KEY', environment.pesapalApiKey);
    return this.http.post(this.requestTokenUrl, {}, { headers });
  }

  submitPayment(paymentToken: string, paymentBody: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${paymentToken}`)
      .set('Content-Type', 'application/json');

    // Construct the Netlify function proxy request URL
    const fullUrl = `${this.netlifyProxyUrl}?url=${encodeURIComponent(this.submitOrderUrl)}`;

    return this.http.post(fullUrl, paymentBody, { headers });
  }
  getTransactionStatus(orderTrackingId: string, transactionToken: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${transactionToken}`)
      .set('Content-Type', 'application/json');
  
    // Construct the proxy URL with the query parameter
    const fullUrl = `${this.netlifyProxyUrl}?url=${encodeURIComponent(`${this.getTransactionUrl}${orderTrackingId}`)}`;
    return this.http.get(fullUrl, { headers });
  }
  
}
