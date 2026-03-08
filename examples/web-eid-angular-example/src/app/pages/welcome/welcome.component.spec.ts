import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

import { WelcomeComponent } from './welcome.component';
import { AuthService } from '../../core/services/auth.service';

class MockAuthService {
  get isLoggedIn() {
    return signal(false).asReadonly();
  }
}

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
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
});
