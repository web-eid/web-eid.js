import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AuthIdCardComponent } from '../../shared/components/auth-id-card/auth-id-card.component';
import { AuthService } from '../../core/services/auth.service';
import { WebEidService } from '../../core/services/web-eid.service';

@Component({
  selector: 'app-welcome',
  imports: [AuthIdCardComponent, RouterModule],
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent {
  webEidStatus?: string;

  constructor(
    private router: Router,
    public authService: AuthService,
    private webEidService: WebEidService,
  ) {}

  async ngOnInit() {
    void this.fetchWebEidStatus();
    await this.authService.fetchUserInfo();
  }

  onAuthSuccess() {
    this.router.navigate(['/sign']);
  }

  private async fetchWebEidStatus() {
    try {
      this.webEidStatus = JSON.stringify(await this.webEidService.status());
    } catch {
      // Keep the demo usable when the extension is not available.
    }
  }
}
