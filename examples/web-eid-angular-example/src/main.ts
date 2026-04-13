import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import initServerMock from './mocks/server-mock-setup';

(async () => {
  await initServerMock();
  
  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
})();
