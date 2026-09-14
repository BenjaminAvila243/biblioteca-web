import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// ─────────────────────────────────────────────────────────────────────────────
// 🔨 TRAMO 8.3 · Acá va la configuración de Amplify, y va **antes** de
//    arrancar la aplicación. Si la pones después, el primer componente que
//    pregunte por la sesión lo va a hacer sobre un Amplify sin configurar.
// ─────────────────────────────────────────────────────────────────────────────

import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId:       'us-east-1_RynZlW8OS',
      userPoolClientId: '1laqa3ba4419ialkks41kj3rle',
      loginWith: {
        oauth: {
          domain:          'us-east-1rynzlw8os.auth.us-east-1.amazoncognito.com',
          scopes:          ['openid', 'profile', 'biblioteca/libros.leer'],
          redirectSignIn:  ['http://localhost:4200/callback'],
          redirectSignOut: ['http://localhost:4200'],
          responseType:    'code',
        },
      },
    },
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// 🔨 Y esta línea, que es la que se olvida. Es lo que hace que Amplify
//    **escuche la vuelta del login** y canjee el código solo.
// ─────────────────────────────────────────────────────────────────────────────

import 'aws-amplify/auth/enable-oauth-listener';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));