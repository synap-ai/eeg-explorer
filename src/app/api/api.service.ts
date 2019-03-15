import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {loginResultModel} from '../shared/classes/loginResultModel';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {

  }

  login(email: string, password: string): Observable<loginResultModel> {
    return this.http.post<loginResultModel>('https://reqres.in/api/login', {
      email: email,
      password: password
    });
  }
  register(first: string, last: string, email: string, password: string): Observable<loginResultModel> {
    return this.http.post<loginResultModel>('https://reqres.in/api/register', {
      firstName: first,
      lastName: last,
      email: email,
      password: password
    });
  }
}
