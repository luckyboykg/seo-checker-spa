import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap/alert';
import { routes } from './app.routes';
import { provideCore } from './core/provider.core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCore(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
