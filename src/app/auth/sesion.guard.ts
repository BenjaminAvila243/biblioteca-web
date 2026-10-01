 import { CanActivateFn } from '@angular/router';
import { fetchAuthSession } from 'aws-amplify/auth';

export const sesionGuard: CanActivateFn = async () => {
  const { tokens } = await fetchAuthSession();


  return !!tokens;
};