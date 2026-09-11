import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ContextInsecureError,
  DeveloperError,
  ExtensionUnavailableError,
  NativeFatalError,
  NativeUnavailableError,
  UnknownError,
  UserCancelledError,
  UserTimeoutError,
  VersionInvalidError,
  VersionMismatchError
} from '@web-eid/web-eid-library';
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

      if (error instanceof UserTimeoutError) {
        this.alert = "ID-card authentication timed out, please try again";
      } else if (error instanceof UserCancelledError) {
        this.alert = "ID-card authentication was cancelled by the user";
      } else if (error instanceof ExtensionUnavailableError) {
        this.alert = "Web eID browser extension is not available, please install it or enable it to continue";
      } else if (error instanceof NativeUnavailableError) {
        this.alert = "Web eID native application is not installed, please install it to continue";
      } else if (error instanceof VersionInvalidError) {
        this.alert = "Web eID native application did not provide a valid version string during handshake, please report a bug";
      } else if (error instanceof VersionMismatchError) {
        if (error.requiresUpdate?.extension) {
          this.alert = "Please update the Web eID browser extension";
        } else if (error.requiresUpdate?.nativeApp) {
          this.alert = "Please update the Web eID native application";
        } else {
          this.alert = "Please update the Web eID native application and browser extension";
        }
      } else if (error instanceof ContextInsecureError) {
        this.alert = "Web eID requires a secure HTTPS connection. Please contact the website administrator";
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

    }

    this.loading = false;
  }
}
