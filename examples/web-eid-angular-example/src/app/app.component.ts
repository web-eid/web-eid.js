// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'web-eid-angular-example';
}
