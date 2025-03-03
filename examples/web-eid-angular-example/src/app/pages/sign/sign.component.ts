import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { SignService } from '../../core/services/sign.service';
import { ErrorCode } from '@web-eid/web-eid-library';
import { isKnownWebEidError } from '../../utils/webEidUtils';

enum SigningSteps {
  Initial = 0,
  Signing = 1,
  Success = 2,
}

@Component({
  selector: 'app-sign',
  imports: [],
  templateUrl: './sign.component.html',
})
export class SignComponent {
  documentId = '123';
  alert?: string;

  step = SigningSteps.Initial;

  constructor(
    public authService: AuthService,
    public signService: SignService,
  ) {}

  async sign() {
    this.step = SigningSteps.Signing;
    this.alert = undefined;

    try {
      await this.signService.signDocument(this.documentId);
      this.step = SigningSteps.Success;
    } catch (error) {
      this.step = SigningSteps.Initial;

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

      throw error;
    }
  }
}
