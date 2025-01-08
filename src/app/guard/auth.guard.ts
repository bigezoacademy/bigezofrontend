import { CanActivateFn } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem("Token");
    if (token) {
      return true;
    } else {
      alert(`NOT AUTHORIZED! ${token}`);
      router.navigate(['/']); // Redirect to home or login
      return false;
    }
  }

  // Deny access for SSR
  return false;
};

