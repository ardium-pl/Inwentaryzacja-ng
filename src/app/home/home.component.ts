import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * The HomeComponent is a standalone Angular component.
 * It uses the RouterOutlet for routing.
 * The component's selector is 'app-home'.
 * The component's template is located at './home.component.html'.
 * The component's styles are located at './home.component.css'.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
