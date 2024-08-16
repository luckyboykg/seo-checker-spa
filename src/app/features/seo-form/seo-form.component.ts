import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SearchProvider } from '@core/constants/common.constant';
import { SeoInfo } from '@core/models/seo-info.model';
import { SeoRequest } from '@core/models/seo-request.model';
import { SearchService } from '@core/services/search.service';
import { SharedModule } from '@shared/shared.module';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  standalone: true,
  imports: [SharedModule, AlertModule, ButtonsModule],
  selector: 'app-seo-form',
  templateUrl: './seo-form.component.html',
  styleUrls: ['./seo-form.component.scss'],
})
export class SeoFormComponent implements OnInit {
  public searchProvider = SearchProvider;
  public radio = SearchProvider.google;

  public urlControl = new UntypedFormControl('', [Validators.required]);
  public searchPhraseControl = new UntypedFormControl('', [
    Validators.required,
    Validators.maxLength(200),
  ]);

  public seoForm = new UntypedFormGroup({});
  public seoInfoArray: SeoInfo[] = [];

  constructor(private searchService: SearchService) {
    this.createFormWithControls();
  }

  ngOnInit(): void {
    this.urlControl.setValue('www.sympli.com.au');
    this.searchPhraseControl.setValue('e-settlements');
  }

  private createFormWithControls(): void {
    this.seoForm = new UntypedFormGroup({
      url: this.urlControl,
      searchPhrase: this.searchPhraseControl,
    });
  }

  public async onSubmit(): Promise<void> {
    this.trimWhiteSpaces();

    if (!this.seoForm.valid) {
      return;
    }

    const seoRequest = <SeoRequest>{
      url: this.urlControl.value,
      searchPhrase: this.searchPhraseControl.value,
    };

    if (this.radio === SearchProvider.google) {
      this.seoInfoArray = [
        await this.searchService.getSeoInfoFromGoogle(seoRequest),
      ];
    } else if (this.radio === SearchProvider.bing) {
      this.seoInfoArray = [
        await this.searchService.getSeoInfoFromBing(seoRequest),
      ];
    } else {
      this.seoInfoArray = await this.searchService.getSeoInfoFromGoogleAndBing(
        seoRequest
      );
    }
  }

  private trimWhiteSpaces(): void {
    this.urlControl.setValue(this.urlControl.value.trim());
    this.searchPhraseControl.setValue(this.searchPhraseControl.value.trim());
  }
}
