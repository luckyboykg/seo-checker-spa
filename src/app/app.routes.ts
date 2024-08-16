import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/seo-form/seo-form.component').then(
            (m) => m.SeoFormComponent
          ),
      },
    ],
  },
];
