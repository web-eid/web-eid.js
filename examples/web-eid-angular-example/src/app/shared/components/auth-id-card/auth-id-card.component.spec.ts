import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthIdCardComponent } from './auth-id-card.component';
import { AuthService } from '../../../core/services/auth.service';

class MockAuthService { }

describe('AuthIdCardComponent', () => {
  let component: AuthIdCardComponent;
  let fixture: ComponentFixture<AuthIdCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthIdCardComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthIdCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
