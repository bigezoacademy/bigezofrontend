import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  //private apiUrl = 'https://bigezo-production.up.railway.app/api/payments'; // Update this with your backend URL
  //private apiUrl2 = 'https://bigezo-production.up.railway.app/api/pesapal/request-token'; // Adjust the URL to match your backend
  //   return this.http.get<string>(`https://bigezo-production.up.railway.app/api/pesapal/transaction-status?orderTrackingId=${orderTrackingId}`);
  private apiUrl = 'http://localhost:8080/api/payments'; // LOCAL TESTING
  private apiUrl2 = 'http://localhost:8080/api/pesapal/request-token'; // LOCAL TESTING
  constructor(private http: HttpClient) {}

submitPayment(orderRequest: any): Observable<string> {
  return this.http.post<string>(`${this.apiUrl}/submit`, orderRequest).pipe(
    catchError((error) => {
      console.error('Payment submission failed', error);
      return throwError(error); // Propagate the error
    })
  );
}

  // getPaymentStatus(orderTrackingId: string): Observable<string> {
  //   return this.http.get<string>(`https://bigezo-production.up.railway.app/api/pesapal/transaction-status?orderTrackingId=${orderTrackingId}`);
  // }

  getPaymentStatus(orderTrackingId: string): Observable<string> {
    return this.http.get<string>(`http://localhost:8080/api/pesapal/transaction-status?orderTrackingId=${orderTrackingId}`);
  }

  /**
   * Makes a payment request to the backend. This method builds the payment body using dynamic and static fields.
   * @param options Object containing dynamic fields: amount, description, and any overrides.
   */
  makePayment(options: {
    amount: number,
    description: string,
    id?: string, // Optional override for transaction id
    callback_url?: string,
    redirect_mode?: string,
    notification_id?: string,
    branch?: string,
    extraFields?: any // For any additional/override fields
  }): Observable<any> {
    // Generate a random 12-character alphanumeric ID with dashes if not provided
    const randomId = options.id || Array(12)
      .fill(0)
      .map((_, i) => (i === 4 || i === 9 ? '-' : Math.random().toString(36).charAt(2)))
      .join('');

    // Get values from localStorage
    const getLS = (key: string) => (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null);
    const studentId = Number(getLS('id'));
    const schoolAdminId = Number(getLS('schoolAdminId'));
    const email_address = getLS('email') || 'student@example.com';
    const phone_number = getLS('phone') || '0704678948';
    const first_name = getLS('firstName') || 'John';
    const middle_name = getLS('middleName') || '';
    const last_name = getLS('lastName') || 'Doe';
    const line_1 = getLS('address1') || '123 Main Street';
    const line_2 = getLS('address2') || '';
    const city = getLS('city') || 'Kampala';
    const state = getLS('state') || '';
    const postal_code = getLS('postalCode') || '';
    const zip_code = getLS('zipCode') || '';
    const notification_id = options.notification_id || getLS('notification_id') || '5bbe0e70-32aa-4204-b00b-dc4bd606fa7f';
    const branch = options.branch || getLS('branch') || 'Store Name - HQ';

    // const paymentInfo: any = {
    //   id: randomId,
    //   currency: 'UGX',
    //   amount: options.amount,
    //   description: options.description,
    //   callback_url: options.callback_url || 'http://bigezo.grealm.org/payment-callback',
    //   redirect_mode: options.redirect_mode || 'iframe',
    //   notification_id: notification_id,
    //   branch: branch,
    //   billing_address: {
    //     email_address,
    //     phone_number,
    //     country_code: 'UG',
    //     first_name,
    //     middle_name,
    //     last_name,
    //     line_1,
    //     line_2,
    //     city,
    //     state,
    //     postal_code,
    //     zip_code
    //   },
    //   school_admin_id: schoolAdminId,
    //   student_id: studentId
    // };

    // Localhost version
    const paymentInfo: any = {
      id: randomId,
      currency: 'UGX',
      amount: options.amount,
      description: options.description,
      callback_url: options.callback_url || 'http://localhost:4200/payment-callback',
      redirect_mode: options.redirect_mode || 'iframe',
      notification_id: notification_id,
      branch: branch,
      billing_address: {
      email_address,
      phone_number,
      country_code: 'UG',
      first_name,
      middle_name,
      last_name,
      line_1,
      line_2,
      city,
      state,
      postal_code,
      zip_code
      },
      school_admin_id: schoolAdminId,
      student_id: studentId
    };

    // Merge any extra/override fields
    if (options.extraFields) {
      Object.assign(paymentInfo, options.extraFields);
    }

    return this.http.post(this.apiUrl, paymentInfo).pipe(
      catchError((error) => {
        // If the backend returns an error response, propagate it to the component
        return throwError(error);
      })
    );
  }

  getPesapalToken(): Observable<any> {
    return this.http.post<any>(this.apiUrl2, {}, { headers: { skipInterceptor: 'true' } });
  }
  
}
