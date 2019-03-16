import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { User } from '../classes/user';
import { Observable } from 'rxjs';

const TOKEN = 'auth_token';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signUpMutation = gql`
    mutation(
      $first_name: String!
      $last_name: String!
      $email: String!
      $password: String!
    ) {
      signUp(
        first_name: $first_name
        last_name: $last_name
        email: $email
        password: $password
      ) {
        token
      }
    }
  `;

  signInMutation = gql`
    mutation(
      $email: String!
      $password: String!
    ) {
      signIn(
        login: $email
        password: $password
      ) {
        token
      }
    }
  `;

  constructor( private cookieService: CookieService, private apollo: Apollo ) { }
  isLoggedIn() {
    return this.cookieService.check(TOKEN);
  }

  login(email: string, password: string) {
    let mut: Observable<any>;
    mut = this.apollo.mutate({
      mutation: this.signInMutation,
      variables: {
        email: email,
        password: password
      },
      errorPolicy: 'all'
    });
    mut.subscribe(({ data }) => {
      if (data && data.signIn.token) {
        console.log('Successfully logged in - ', data);
        this.cookieService.set(TOKEN, data.signIn.token);
      }
    }, (error) => {
      console.log('There was an error registering user', error);
    });

    return mut;
  }

  register(user: User, password: string) {
    let mut: Observable<any>;
    mut = this.apollo.mutate({
      mutation: this.signUpMutation,
      variables: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: password
      },
      errorPolicy: 'all'
    });
    mut.subscribe(({ data }) => {
      if (data && data.signUp.token) {
        this.cookieService.set(TOKEN, data.signUp.token);
      }
    }, (error) => {
      console.log('There was an error registering user', error);
    });

    return mut;
  }

  logout() {
    this.cookieService.delete(TOKEN);
  }
}
