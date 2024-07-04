import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';


/**
 * The NavbarComponent is a standalone Angular component.
 * It uses the RouterLink for routing.
 * The component's selector is 'app-navbar'.
 * The component's template is located at './navbar.component.html'.
 * The component's styles are located at './navbar.component.css'.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
}
