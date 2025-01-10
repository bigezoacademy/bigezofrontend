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
      const expectedRoles = route.data?.['role']; // Fetch expected roles from route data
      if (Array.isArray(expectedRoles)) {
        // Check if userRole is in the allowed roles
        if (!expectedRoles.includes(userRole)) {
          alert(`NOT AUTHORIZED FOR THIS ROLE`);
          router.navigate([userRole === 'ROLE_ADMIN' ? '/admin' :
                            userRole === 'ROLE_TEACHER' ? '/teacher' :
                            userRole === 'ROLE_USER' ? '/student' : '/']);
          return false;
        }
      } else if (userRole !== expectedRoles) {
        // Handle single role as a fallback
        alert(`NOT AUTHORIZED FOR THE ROLE ${expectedRoles}`);
        router.navigate([userRole === 'ROLE_ADMIN' ? '/admin' :
                          userRole === 'ROLE_TEACHER' ? '/teacher' :
                          userRole === 'ROLE_USER' ? '/student' : '/']);
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
