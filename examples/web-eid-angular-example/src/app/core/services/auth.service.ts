import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { LanguageService } from './language.service';
import { WebEidService } from './web-eid.service';

enum AuthState {
  Unknown,
  LoggedIn,
  LoggedOut,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  headers = { 'Content-Type': 'application/json' };

  private _authState = signal(AuthState.Unknown);
  readonly isLoggedIn = computed(() => this._authState() === AuthState.LoggedIn);

  user: { sub: string, auth: string } | null = null;

  constructor(
    private webEidService: WebEidService,
    private languageService: LanguageService,
    private http: HttpClient,
  ) { }

  async fetchUserInfo() {
    try {
      this.user = await firstValueFrom(
        this.http.get<typeof this.user>('/auth/user', {
          headers: { 'Content-Type': 'application/json' },
        })
      );

      this._authState.set(AuthState.LoggedIn);
    } catch (error) {
      this._authState.set(AuthState.LoggedOut);
      throw error;
    }
  }

  async checkAuthState(): Promise<boolean> {
    if (this._authState() === AuthState.LoggedIn) {
      return true;
    } else if (this._authState() === AuthState.LoggedOut) {
      return false;
    } else {
      try {
        await this.fetchUserInfo();
        return this._authState() === AuthState.LoggedIn;
      } catch {
        return false;
      }
    }
  }

  async authenticate(): Promise<void> {
    const { nonce } = await firstValueFrom(
      this.http.get<{ nonce: string }>('/auth/challenge', {
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const authToken = await this.webEidService.authenticate(nonce, { lang: this.languageService.language() });

    const body = {
      'auth-token': authToken,
    };

    const authTokenResult = await firstValueFrom(
      this.http.post<typeof this.user>('/auth/login', body, {
        headers: { 'Content-Type': 'application/json' },
      })
    );

    this.user = authTokenResult;

    this._authState.set(AuthState.LoggedIn);
  }

  async logout(): Promise<void> {
    await firstValueFrom(
      this.http.post('/auth/logout', {}, {
        headers: { 'Content-Type': 'application/json' },
      })
    );

    this._authState.set(AuthState.LoggedOut);
  }
}
