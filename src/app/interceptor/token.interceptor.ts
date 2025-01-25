import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Check if the request is for the Pesapal API
  if (req.url.includes('/api/pesapal/')) {
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
