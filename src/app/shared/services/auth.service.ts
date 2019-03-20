import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  TOKEN = 'auth_token';

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
    return this.cookieService.check(this.TOKEN);
  }

  login(email: string, password: string) {
    return this.apollo.mutate({
      mutation: this.signInMutation,
      variables: {
        email: email,
        password: password
      },
      errorPolicy: 'all'
    });
  }

  register(user: User, password: string) {
    return this.apollo.mutate({
      mutation: this.signUpMutation,
      variables: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: password
      },
      errorPolicy: 'all'
    });
  }

  logout() {
    this.cookieService.delete(this.TOKEN);
  }
}
