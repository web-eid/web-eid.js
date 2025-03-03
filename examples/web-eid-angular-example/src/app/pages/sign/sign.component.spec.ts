import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignComponent } from './sign.component';
import { AuthService } from '../../core/services/auth.service';
import { SignService } from '../../core/services/sign.service';

class MockAuthService { }
class MockSignService { }

describe('SignComponent', () => {
  let component: SignComponent;
  let fixture: ComponentFixture<SignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: SignService, useClass: MockSignService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
