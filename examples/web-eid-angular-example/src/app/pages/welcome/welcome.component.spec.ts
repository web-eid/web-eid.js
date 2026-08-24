import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

import { WelcomeComponent } from './welcome.component';
import { AuthService } from '../../core/services/auth.service';
import { WebEidService } from '../../core/services/web-eid.service';

class MockAuthService {
  get isLoggedIn() {
    return signal(false).asReadonly();
  }

  async fetchUserInfo() {}
}

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let router: Router;

  beforeEach(async () => {
    const webEidService = jasmine.createSpyObj<WebEidService>('WebEidService', ['status']);
    webEidService.status.and.returnValue(Promise.resolve({
      library: '2.1.0-beta.2',
      extension: '2.3.0',
      nativeApp: '2.4.0',
    }));

    await TestBed.configureTestingModule({
      imports: [WelcomeComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: WebEidService, useValue: webEidService },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call router.navigate when onAuthSuccess is invoked', () => {
    component.onAuthSuccess();
    expect(router.navigate).toHaveBeenCalledWith(['/sign']);
  });

  it('should render the AuthIdcardComponent element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-auth-id-card')).toBeTruthy();
  });

  it('should render the Web eID status', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Web eID status: {"library":"2.1.0-beta.2","extension":"2.3.0","nativeApp":"2.4.0"}');
  });
});
