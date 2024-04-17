/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

const providers = [{ provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers)
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

function addScript(link: any) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = link;
  document.head.append(script);
}
//test
// function addLink(css: any) {
//   const link = document.createElement('link');
//   link.href = css;
//   link.rel = 'stylesheet';
//   document.head.append(link);
// }

// addScript('https://code.jquery.com/jquery-3.4.1.min.js');
// addScript(
//   'https://cdn.jsdelivr.net/npm/summernote@0.8.15/dist/summernote-lite.min.js'
// );
// addLink(
//   'https://cdn.jsdelivr.net/npm/summernote@0.8.15/dist/summernote-lite.min.css'
// );
