import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloModule } from 'apollo-angular';
import { ModuleWithProviders } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { HttpErrorResponse, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { concat, ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';

@NgModule({
  imports: [
    ApolloModule,
    HttpLinkModule,
    HttpClientModule
  ],
  declarations: [],
  exports: [ApolloModule]
})
export class GraphQLModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GraphQLModule,
      providers: [],
    };
  }
  constructor(
    apollo: Apollo,
    httpLink: HttpLink,
  ) {

    const http = httpLink.create({
      uri: 'http://graphqlapi/',
    });

    const link = httpLink.create({
      uri: 'https://synap-ai.appspot.com/graphql'
    });
    const authMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      operation.setContext({
        headers: new HttpHeaders().set('x-token', localStorage.getItem('auth_token') || '')
      });
      return forward(operation);
    });
    const logoutLink = onError( (error) => {
      try {
        if ((error.networkError as any).error.errors[0].extensions.code === 'UNAUTHENTICATED') {
          localStorage.removeItem('auth_token');
          // if (router.url !== '/login') {
          //   router.navigate(['/login']);
          // }
        }
      } catch {
        // nothing
      }
    });

    apollo.create({
      cache: new InMemoryCache(),
      link: logoutLink.concat(concat(authMiddleware, link))
    });
  }
 }
