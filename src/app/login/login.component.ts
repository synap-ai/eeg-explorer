import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api/api.service';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginOptions: FormGroup;
  registerOptions: FormGroup;
  login: boolean;

  constructor(private api: ApiService, private customer: AuthService, private router: Router, fb: FormBuilder) {
    this.login = true;
    this.loginOptions = fb.group({
      username: '',
      password: ''
    });
    this.registerOptions = fb.group({
      firstname: '',
      lastname: '',
      emailReg: '',
      passwordReg: ''
    });
  }

  switch() {
    this.login = !this.login;
  }
  ngOnInit() {
  }

  tryLogin(email, password) {
    this.api.login(
      email,
      password
    )
      .subscribe(
        r => {
          if (r.token) {
            this.customer.setToken(r.token);
            this.router.navigateByUrl('/experiments');
          }
        },
        r => {
          alert(r.error.error);
        });
  }
  tryRegister(first, last, email, password) {
    this.api.register(
      first,
      last,
      email,
      password
    ).subscribe(
        r => {
          if (r.token) {
            this.customer.setToken(r.token);
            this.router.navigateByUrl('/sessions');
          }
        },
        r => {
          alert(r.error.error);
        });
  }

}
