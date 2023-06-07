import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { BillDetails, Profile, User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:4400';
  // private baseUrl = 'http://localhost:3000';

  arrUsers: User[] = [];
  tempProfile: Profile = new Profile(0, '', '', [], [], [], [])
  user: User = new User('', '', '', 0, '', '', [], new BillDetails(0, '', 0, '', ''));
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {
    // console.log('User Constructor is called');
  }

  // getUsers(): Observable<User[]> {
  //   return this.httpClient
  //     .get<User[]>(this.baseUrl + '/users')
  //     .pipe(retry(1), catchError(this.httpError));
  // }


  getUserByEmailOrPhoneNumber(emailOrPhoneNumber: string): Observable<User> {
    const params = { emailOrPhoneNumber }
    return this.httpClient
      .post<User>(this.baseUrl + '/user', params)
      .pipe(retry(1), catchError(this.httpError));
  }

  getUserById(objectId: string): Observable<User> {
    const params = { objectId }
    return this.httpClient
      .post<User>(this.baseUrl + '/userone', params)
      .pipe(retry(1), catchError(this.httpError));
  }

  addUser(user: User): Observable<User> {
    return this.httpClient
      .post<User>(this.baseUrl + '/usersignup', JSON.stringify(user), this.httpHeader)
      .pipe(retry(1), catchError(this.httpError));
  }

  checkEmail(email:string):Observable<any>{
    const params = { email }
    return this.httpClient
      .post<User>(this.baseUrl + '/checkemail', params)
      .pipe(retry(1), catchError(this.httpError));
  }

  deleteUser(user_Id: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.baseUrl}/deluser/${user_Id}`, this.httpHeader)
      .pipe(retry(1), catchError(this.httpError));
  }

  updateUser(u: User): Observable<User> {
    return this.httpClient
      .put<User>(
        `${this.baseUrl}/users/${u._id}`,
        JSON.stringify(u),
        this.httpHeader
      )
      .pipe(retry(1), catchError(this.httpError));
  }

  httpError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = 'Error Code:${error.status}\n Message:${error.message}';
    }
    console.log(msg);
    return throwError(msg);
  }
}
