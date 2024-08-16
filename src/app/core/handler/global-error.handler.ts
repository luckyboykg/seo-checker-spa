import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    let message = error.message ? error.message : error.toString();

    const router = this.injector.get(Router);
    const url = location instanceof Router ? router.url : '';

    console.error(`Message: ${message} - URL: ${url}`);
  }
}
