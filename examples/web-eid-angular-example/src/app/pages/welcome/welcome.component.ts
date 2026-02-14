import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AuthIdCardComponent } from '../../shared/components/auth-id-card/auth-id-card.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-welcome',
  imports: [AuthIdCardComponent, RouterModule],
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent {
  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  async ngOnInit() {
    await this.authService.fetchUserInfo();
  }

  onAuthSuccess() {
    this.router.navigate(['/sign']);
  }
}
