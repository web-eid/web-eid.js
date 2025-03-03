import { Component, Signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-header',
  imports: [
    FormsModule, RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  language: Signal<string>;
  languageOptions: Array<{ code: string; label: string; }>;

  constructor(
    private languageService: LanguageService,
    private router: Router,
    public authService: AuthService,
  ) {
    this.languageOptions = (
      Object
      .entries(this.languageService.languages)
      .map(([ code, label ]) => ({ code, label }))
    );

    this.language = this.languageService.language;
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/']);
    } catch (error: unknown) {
      alert((error as Error).message ?? error);
    }
  }

}
