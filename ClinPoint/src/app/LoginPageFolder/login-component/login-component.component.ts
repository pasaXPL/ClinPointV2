import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/Services/auth.service';
import { initTE, Input, Ripple } from "tw-elements";
import { DataService } from 'src/app/Services/data.service';
import { Account } from 'src/app/Models/model.model'

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.scss']
})
export class LoginComponentComponent {

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  })
  constructor(private auth: AuthService, private router: Router, private data: DataService) { }

  account : Account = {
    addressId: '',
    id: '',
    username: '',
    password: '',
    role: ''
  };

  ngOnInit() {
    initTE({ Input, Ripple });
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['dashboard']);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      var res = await this.data.loginAccount(this.loginForm.value.username!, this.loginForm.value.password!);
      if (res) {
        this.account = res;
        this.auth.loginUser(res);
      } else {
        alert('Account not found!')
      }
    }
    else
    {
      alert('Please input username and password')
    }
  }
}
