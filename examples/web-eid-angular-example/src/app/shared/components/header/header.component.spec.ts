import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { routes } from '../../../app.routes';

class MockAuthService {
  get isLoggedIn() {
    return signal(false).asReadonly();
  }

  logout() {
    return Promise.resolve();
  }
}

class MockLanguageService {
  languages = { en: 'English', et: 'Estonian' };
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: LanguageService, useClass: MockLanguageService },
        provideRouter(routes),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize language options', () => {
    expect(component.languageOptions).toEqual([
      { code: 'en', label: 'English' },
      { code: 'et', label: 'Estonian' }
    ]);
  });

  it('should logout and navigate to / on logout', async () => {
    const navigateSpy = spyOn(router, 'navigate').and.callThrough();
    spyOn(authService, 'logout').and.callThrough();
    await component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should handle logout error', async () => {
    spyOn(authService, 'logout').and.throwError('Logout error');
    spyOn(window, 'alert');
    await component.logout();
    expect(window.alert).toHaveBeenCalledWith('Logout error');
  });
});
