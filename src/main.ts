// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor, errorInterceptor])
    ),
    provideAnimations()
  ]
}).catch(err => console.error(err));