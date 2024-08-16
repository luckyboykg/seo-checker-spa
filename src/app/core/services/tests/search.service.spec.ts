import { TestBed } from '@angular/core/testing';
import { HttpMethod } from '@core/enums/common.enum';
import { SeoRequest } from '@core/models/seo-request.model';
import { SeoInfo } from '@core/models/seo-info.model';
import { SearchService } from '../search.service';
import { HttpService } from '../http.service';

describe('SearchService', () => {
  let service: SearchService;
  let httpServiceMock: any;

  beforeEach(() => {
    httpServiceMock = jasmine.createSpyObj('HttpService', ['callAsync']);

    TestBed.configureTestingModule({
      providers: [
        SearchService,
        { provide: HttpService, useValue: httpServiceMock },
      ],
    });

    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call HttpService for getSeoInfoFromGoogle', async () => {
    const seoRequest: SeoRequest = {
      url: 'http://example.com',
      searchPhrase: 'example',
    };
    const seoInfo: SeoInfo = { position: '1', searchProvider: 'google' };
    httpServiceMock.callAsync.and.returnValue(Promise.resolve(seoInfo));

    const result = await service.getSeoInfoFromGoogle(seoRequest);

    expect(httpServiceMock.callAsync).toHaveBeenCalledWith(
      HttpMethod.GET,
      '/seo/google',
      seoRequest
    );
    expect(result).toEqual(seoInfo);
  });

  it('should call HttpService for getSeoInfoFromBing', async () => {
    const seoRequest: SeoRequest = {
      url: 'http://example.com',
      searchPhrase: 'example',
    };
    const seoInfo: SeoInfo = { position: '1', searchProvider: 'bing' };
    httpServiceMock.callAsync.and.returnValue(Promise.resolve(seoInfo));

    const result = await service.getSeoInfoFromBing(seoRequest);

    expect(httpServiceMock.callAsync).toHaveBeenCalledWith(
      HttpMethod.GET,
      '/seo/bing',
      seoRequest
    );
    expect(result).toEqual(seoInfo);
  });

  it('should call getSeoInfoFromGoogle and getSeoInfoFromBing for getSeoInfoFromGoogleAndBing', async () => {
    const seoRequest: SeoRequest = {
      url: 'http://example.com',
      searchPhrase: 'example',
    };
    const seoInfoGoogle: SeoInfo = { position: '1', searchProvider: 'google' };
    const seoInfoBing: SeoInfo = { position: '2', searchProvider: 'bing' };

    httpServiceMock.callAsync.and.callFake(
      (_method: HttpMethod, url: string, _request: SeoRequest) => {
        if (url === '/seo/google') {
          return Promise.resolve(seoInfoGoogle);
        } else if (url === '/seo/bing') {
          return Promise.resolve(seoInfoBing);
        }
        return Promise.reject('Unknown URL');
      }
    );

    const result = await service.getSeoInfoFromGoogleAndBing(seoRequest);

    expect(httpServiceMock.callAsync).toHaveBeenCalledWith(
      HttpMethod.GET,
      '/seo/google',
      seoRequest
    );
    expect(httpServiceMock.callAsync).toHaveBeenCalledWith(
      HttpMethod.GET,
      '/seo/bing',
      seoRequest
    );
    expect(result).toEqual([seoInfoGoogle, seoInfoBing]);
  });
});
