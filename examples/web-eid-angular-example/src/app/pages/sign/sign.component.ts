import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { SignService } from '../../core/services/sign.service';
import {
  DeveloperError,
  NativeFatalError,
  UnknownError,
  UserCancelledError,
  UserTimeoutError,
} from '@web-eid/web-eid-library';
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

      if (error instanceof UserTimeoutError) {
        this.alert = "ID-card authentication timed out, please try again";
      } else if (error instanceof UserCancelledError) {
        this.alert = "ID-card authentication was cancelled by the user";
      } else if (error instanceof NativeFatalError) {
        this.alert = "Please try again. If the problem persists, contact support";
      } else if (error instanceof DeveloperError) {
        this.alert = `An internal error occurred. Please contact support! ${error.message}`;
      } else if (error instanceof UnknownError) {
        this.alert = `An unknown error occurred. Please try again and contact support if the problem persists! ${error.message} (${error.code})`;
      } else {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorCode = isKnownWebEidError(error) ? ` (${(error as any).code})` : "";
        this.alert = `An unknown error occurred. Please try again and contact support if the problem persists! ${errorMessage}${errorCode}`;
      }

      throw error;
    }
  }
}
