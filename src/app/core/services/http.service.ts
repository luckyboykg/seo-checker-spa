import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { lastValueFrom, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@app/environments/environment';
import { HttpMethod } from '@core/enums/common.enum';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiAddress = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) {}

  public callAsync(
    method: HttpMethod,
    url: string,
    args?: any,
    httpHeaders?: HttpHeaders,
    apiAddress?: string
  ): Promise<any> {
    if (!httpHeaders) {
      httpHeaders = new HttpHeaders();
    }
    if (!apiAddress) {
      apiAddress = this.apiAddress;
    }

    if (apiAddress === window.location.host) {
      return lastValueFrom(this.call(method, url, args, httpHeaders));
    }

    return lastValueFrom(
      this.call(method, apiAddress + url, args, httpHeaders)
    );
  }

  public call(
    method: HttpMethod,
    url: string,
    args?: any,
    httpHeaders?: HttpHeaders | undefined
  ): Observable<any> {
    httpHeaders = httpHeaders?.append('ngsw-bypass', 'true');

    switch (method) {
      case HttpMethod.GET:
        const options = { headers: httpHeaders, params: args };

        return this.httpClient.get(url, options).pipe(
          catchError((err: any) => {
            if (
              err.status === HttpStatusCode.Forbidden ||
              err.status === HttpStatusCode.Unauthorized
            ) {
              throw err;
            }
            // Avoid Error: 404 Not Found
            return of(undefined);
          })
        );

      case HttpMethod.POST:
        return this.httpClient.post(url, args, {
          headers: httpHeaders,
        });
      case HttpMethod.PUT:
        return this.httpClient.put(url, args, { headers: httpHeaders });
      case HttpMethod.PATCH:
        return this.httpClient.patch(url, args, {
          headers: httpHeaders,
        });
      default:
        return this.httpClient.delete(url, { headers: httpHeaders });
    }
  }
}
