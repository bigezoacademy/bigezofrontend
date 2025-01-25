import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Check if the request is for Pesapal API endpoints you want to exclude
  if (req.url.includes('/api/pesapal/') || req.url.includes('https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest')) {
    // Don't modify the request for Pesapal API, simply pass it along
    return next(req);
  }

  // Get the token from localStorage
  const token = localStorage.getItem("Token");

  // If there's a token, clone the request and add the Authorization header
  if (token) {
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(newReq);
  }

  // If no token is found, proceed with the original request
  return next(req);
};
