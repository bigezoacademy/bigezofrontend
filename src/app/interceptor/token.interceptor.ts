import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has('skipInterceptor')) {
    const newReq = req.clone({ headers: req.headers.delete('skipInterceptor') });
    return next(newReq);
  }
  const token = localStorage.getItem("Token");
  if (token) {
    const newReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(newReq);
  }
  return next(req);
};

