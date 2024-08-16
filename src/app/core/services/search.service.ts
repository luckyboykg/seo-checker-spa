import { Injectable } from '@angular/core';
import { HttpMethod } from '@core/enums/common.enum';
import { SeoInfo } from '@core/models/seo-info.model';
import { SeoRequest } from '@core/models/seo-request.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly baseUrl = '/seo/';

  constructor(private httpService: HttpService) {}

  public getSeoInfoFromGoogle(seoRequest: SeoRequest): Promise<SeoInfo> {
    return this.httpService.callAsync(
      HttpMethod.GET,
      this.baseUrl + 'google',
      seoRequest
    );
  }

  public getSeoInfoFromBing(seoRequest: SeoRequest): Promise<SeoInfo> {
    return this.httpService.callAsync(
      HttpMethod.GET,
      this.baseUrl + 'bing',
      seoRequest
    );
  }

  public getSeoInfoFromGoogleAndBing(
    seoRequest: SeoRequest
  ): Promise<SeoInfo[]> {
    return Promise.all([
      this.getSeoInfoFromGoogle(seoRequest),
      this.getSeoInfoFromBing(seoRequest),
    ]);
  }
}
