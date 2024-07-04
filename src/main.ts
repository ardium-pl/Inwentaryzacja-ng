import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';

/**
 * This is the main entry point for the Angular application.
 *
 * The bootstrapApplication function from '@angular/platform-browser' is used to bootstrap the application.
 * The AppComponent is passed as the root component to bootstrap the application.
 * The appConfig is passed as the configuration for the application.
 *
 * If there is an error during the bootstrapping process, it is caught and logged to the console.
 */

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
