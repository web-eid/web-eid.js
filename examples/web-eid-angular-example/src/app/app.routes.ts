import { Routes } from '@angular/router';
import { SignComponent } from './pages/sign/sign.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'sign', component: SignComponent, canActivate: [authGuard] },
];
