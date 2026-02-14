import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorCode } from '@web-eid/web-eid-library';

import { AuthService } from '../../../core/services/auth.service';
import { isKnownWebEidError } from '../../../utils/webEidUtils';

@Component({
  selector: 'app-auth-id-card',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-id-card.component.html',
})
export class AuthIdCardComponent {
  @Output() authSuccess = new EventEmitter<void>();
  
  alert?: string;
  loading = false;

  constructor(private authService: AuthService) {}

  async login() {
    this.alert = undefined;
    this.loading = true;

    try {
      await this.authService.authenticate();
      this.authSuccess.emit();
    } catch (error) {
      console.error(error);

      if (isKnownWebEidError(error)) {
        switch (error.code) {
          case ErrorCode.ERR_WEBEID_USER_CANCELLED:
            this.alert = "You cancelled the ID-card authentication.";
            break;

          case ErrorCode.ERR_WEBEID_USER_TIMEOUT:
            this.alert = "Sorry, the ID-card PIN entry took too long.";
            break;

          default:
            this.alert = error.message;
            break;
        }
      } else {
        this.alert = "Something went wrong.";
      }
    }

    this.loading = false;
  }
}
