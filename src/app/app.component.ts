import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ColorToggleComponent } from './color-toggle/color-toggle.component';
import { FooterService } from './footer.service';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NavbarComponent,
    HomeComponent,
    ColorToggleComponent,
    NgIf,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{
  readonly footerService = inject(FooterService);

  ngOnInit(): void {
    this.footerService.displayFooter.set(true);
  }
}
