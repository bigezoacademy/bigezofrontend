import { CanActivateFn } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('Token');
    const userRole = localStorage.getItem('Role'); // Retrieve role from localStorage

    if (token && userRole) {
      const expectedRole = route.data?.['role']; // Fetch expected role from route data
      if (expectedRole && userRole !== expectedRole) {
        alert(`NOT AUTHORIZED FOR THE ROLE ${expectedRole}`);
        router.navigate([userRole === 'ROLE_ADMIN' ? '/admin':userRole === 'ROLE_TEACHER' ? '/' : '/student']);
        return false;
      }
      return true;
    } else {
      alert('NOT AUTHORIZED!');
      router.navigate(['/']);
      return false;
    }
  }

  return false; // Deny access for server-side rendering
};
