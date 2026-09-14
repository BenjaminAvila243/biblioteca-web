import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { fetchAuthSession } from 'aws-amplify/auth';

export const sesionGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const { tokens } = await fetchAuthSession();

  if (tokens) {
    return true;
  }

  return router.createUrlTree(['/']);
};