import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { User } from '../classes/user';
import { share } from 'rxjs/operators';

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

  constructor(private apollo: Apollo) { }
  isLoggedIn() {
    const loggedIn = !!localStorage.getItem(this.TOKEN);
    return loggedIn;
  }

  login(email: string, password: string) {
    this.logout();
    const response = this.apollo.mutate({
      mutation: this.signInMutation,
      variables: {
        email: email,
        password: password
      },
      errorPolicy: 'ignore'
    }).pipe(share());
    response.subscribe(
      ({ errors, data }) => {
        if (data && data.signIn.token) {
          localStorage.setItem(this.TOKEN, data.signIn.token);
        }
      },
      error => {
        console.log('There was an error registering user', error);
      }
    );
    return response;
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
      errorPolicy: 'ignore'
    });
  }

  logout() {
    localStorage.removeItem(this.TOKEN);
    this.apollo.getClient().resetStore();
  }
}
