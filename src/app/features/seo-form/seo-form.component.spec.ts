import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SeoInfo } from '@core/models/seo-info.model';
import { SearchService } from '@core/services/search.service';
import { SeoFormComponent } from './seo-form.component';

describe('SeoFormComponent', () => {
  let component: SeoFormComponent;
  let fixture: ComponentFixture<SeoFormComponent>;
  let searchServiceMock: any;

  beforeEach(async () => {
    searchServiceMock = jasmine.createSpyObj('SearchService', [
      'getSeoInfoFromGoogle',
      'getSeoInfoFromBing',
      'getSeoInfoFromGoogleAndBing',
    ]);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [{ provide: SearchService, useValue: searchServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.urlControl.value).toBe('www.sympli.com.au');
    expect(component.searchPhraseControl.value).toBe('e-settlements');
  });

  it('should trim whitespace from form controls on submit', () => {
    component.urlControl.setValue('  www.sympli.com.au  ');
    component.searchPhraseControl.setValue('  e-settlements  ');

    component.onSubmit();

    expect(component.urlControl.value).toBe('www.sympli.com.au');
    expect(component.searchPhraseControl.value).toBe('e-settlements');
  });

  it('should not call search service if form is invalid', () => {
    component.urlControl.setValue('');
    component.searchPhraseControl.setValue('');

    component.onSubmit();

    expect(searchServiceMock.getSeoInfoFromGoogle).not.toHaveBeenCalled();
    expect(searchServiceMock.getSeoInfoFromBing).not.toHaveBeenCalled();
    expect(
      searchServiceMock.getSeoInfoFromGoogleAndBing
    ).not.toHaveBeenCalled();
  });

  it('should call getSeoInfoFromGoogle when google radio is selected', async () => {
    const mockSeoInfo: SeoInfo = { position: '1', searchProvider: 'google' };
    searchServiceMock.getSeoInfoFromGoogle.and.returnValue(
      Promise.resolve(mockSeoInfo)
    );

    component.radio = 'google';
    component.urlControl.setValue('www.sympli.com.au');
    component.searchPhraseControl.setValue('e-settlements');

    await component.onSubmit();

    expect(searchServiceMock.getSeoInfoFromGoogle).toHaveBeenCalled();
    expect(component.seoInfoArray).toEqual([mockSeoInfo]);
  });

  it('should call getSeoInfoFromBing when bing radio is selected', async () => {
    const mockSeoInfo: SeoInfo = { position: '1', searchProvider: 'bing' };
    searchServiceMock.getSeoInfoFromBing.and.returnValue(
      Promise.resolve(mockSeoInfo)
    );

    component.radio = 'bing';
    component.urlControl.setValue('www.sympli.com.au');
    component.searchPhraseControl.setValue('e-settlements');

    await component.onSubmit();

    expect(searchServiceMock.getSeoInfoFromBing).toHaveBeenCalled();
    expect(component.seoInfoArray).toEqual([mockSeoInfo]);
  });

  it('should call getSeoInfoFromGoogleAndBing when both radio is selected', async () => {
    const mockSeoInfoArray: SeoInfo[] = [
      { position: '1', searchProvider: 'google' },
      { position: '2', searchProvider: 'bing' },
    ];
    searchServiceMock.getSeoInfoFromGoogleAndBing.and.returnValue(
      Promise.resolve(mockSeoInfoArray)
    );

    component.radio = 'both';
    component.urlControl.setValue('www.sympli.com.au');
    component.searchPhraseControl.setValue('e-settlements');

    await component.onSubmit();

    expect(searchServiceMock.getSeoInfoFromGoogleAndBing).toHaveBeenCalled();
    expect(component.seoInfoArray).toEqual(mockSeoInfoArray);
  });
});
