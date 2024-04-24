import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { RtcService } from './core/services/rtc-service/rtc.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(),
    {provide: RtcService}
  ]
};
