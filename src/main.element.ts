import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { ElementModule } from './app/element.module';

// eslint-disable-next-line no-console
platformBrowserDynamic()
  .bootstrapModule(ElementModule)
  .catch((err) => console.log(err));
