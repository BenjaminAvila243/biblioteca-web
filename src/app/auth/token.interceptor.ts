import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { fetchAuthSession } from 'aws-amplify/auth';

const PERMITIDOS = ['http://localhost:8080'];   // solo tu gateway

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const esPermitido = PERMITIDOS.some((base) => req.url.startsWith(base));

  if (!esPermitido) {
    return next(req);
  }

  return from(fetchAuthSession()).pipe(
    switchMap((session) => {
      const token = session.tokens?.accessToken?.toString();
      if (!token) {
        return next(req);
      }
      const clonada = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(clonada);
    }),
  );
};