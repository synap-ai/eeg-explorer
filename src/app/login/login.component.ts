import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../shared/classes/user';
import { MatSnackBar } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginOptions: FormGroup;
  registerOptions: FormGroup;
  login: boolean;

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    fb: FormBuilder,
    private cookieService: CookieService
  ) {
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
  ngOnInit() {}

  tryLogin(email: string, password: string) {
    this.authService.login(email, password).subscribe(
      (response) => {
        const data = response.data;
        if (data && data.signIn.token) {
          this.router.navigateByUrl('/experiments');
        } else {
          this.snackBar.open(`Login failed: Bad Username or Password`, 'Dismiss', {
            duration: 3000
          });
        }
      }
    );
  }

  tryRegister(
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) {
    const newUser = new User({
      first_name: first_name,
      last_name: last_name,
      email: email
    });
    this.authService.register(newUser, password).subscribe(
      ({ errors, data }) => {
        if (data && data.signUp.token) {
          localStorage.setItem(this.authService.TOKEN, data.signUp.token);
          this.router.navigateByUrl('/experiments');
        } else {
          this.snackBar.open(
            `Registration failed`,
            'Dismiss',
            {
              duration: 3000
            }
          );
        }
      },
      error => {
        console.log('There was an error registering user', error);
      }
    );
  }
}
