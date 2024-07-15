import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ColorToggleComponent } from './color-toggle/color-toggle.component';

/**
 * @Component decorator to define AppComponent.
 * The selector 'app-root' is the name you can use to embed the AppComponent in the HTML of other components.
 * The standalone property is set to true, which means that the component will have its own change detector and optionally its own injector.
 * The imports array is used to import other components/directives to be used in the template.
 * templateUrl and styleUrl are used to link the HTML template and CSS for this component respectively.
 */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NavbarComponent,
    HomeComponent,
    ColorToggleComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title: string = 'Ag-Grid-Testing';
}
