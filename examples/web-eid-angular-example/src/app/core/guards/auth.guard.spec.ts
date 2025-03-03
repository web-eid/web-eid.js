import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';


class MockAuthService {
  checkAuthState() {
    return Promise.resolve(false);
  }
}

describe('authGuard', () => {
  let authService: MockAuthService;
  let router: Router;

  const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
  const mockRouterStateSnapshot = {} as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService
        }
      ]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should return true if the user is logged in', async () => {
    spyOn(authService, 'checkAuthState').and.resolveTo(true);
    
    const result = await TestBed.runInInjectionContext(() => authGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot));

    expect(result).toBe(true);
  });

  it('should return false if the user is not logged in', async () => {
    spyOn(authService, 'checkAuthState').and.resolveTo(false);

    const result = await TestBed.runInInjectionContext(() => authGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot));
    expect(result).toEqual(router.createUrlTree(['/']));
  });
});
