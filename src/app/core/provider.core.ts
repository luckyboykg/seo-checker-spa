import { ErrorHandler, Provider } from '@angular/core';
import { GlobalErrorHandler } from './handler/global-error.handler';

export function provideCore(): Provider[] {
  return [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ];
}
