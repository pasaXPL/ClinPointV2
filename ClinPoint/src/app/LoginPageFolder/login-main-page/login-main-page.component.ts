import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login-main-page',
  templateUrl: './login-main-page.component.html',
  styleUrls: ['./login-main-page.component.scss']
})
export class LoginMainPageComponent {
  constructor(private auth:AuthService, private router:Router){}
  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['dashboard']);
    }
  }
}
