import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

/**
 * The application configuration object.
 *
 * This object is used to configure the Angular application at the bootstrap stage.
 * It includes the providers for zone change detection, routing, and animations.
 *
 * @type {ApplicationConfig}
 *
 * @property {Array} providers - An array of providers for the application.
 *
 * @property {Function} providers[0] - The provider for zone change detection.
 * It is configured to enable event coalescing.
 *
 * @property {Function} providers[1] - The provider for routing.
 * It uses the routes defined in 'app.routes'.
 *
 * @property {Function} providers[2] - The provider for animations.
 * It is configured to provide animations asynchronously.
 */


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimationsAsync()]
};
