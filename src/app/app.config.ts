import { ApplicationConfig, LOCALE_ID, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {  authInterceptor } from './core/interceptors/auth.interceptor';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';


registerLocaleData(localePt, 'pt-BR');


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([
        authInterceptor
    ])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    {
        provide: DecimalPipe,
        useFactory: () => {
            const pipe = new DecimalPipe('pt-BR');
            return pipe;
        },
    }
]
};
