import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

import { catchError, Observable, retry, throwError } from 'rxjs';
import { Movie } from '../models/movies';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private serverUrl = 'http://localhost:4400';
  // serverUrl = 'http://localhost:3000';

  arrMovies: Movie[] = [];
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  movie: Movie = new Movie(0, '', '', [], 0, 0, [], [], '', '', 0, '', '', '');
  constructor(private httpClient: HttpClient) { }


  getMovieById(id: number): Observable<Movie> {
    const params = { id }
    return this.httpClient
      .post<Movie>(this.serverUrl + '/movie', params)
      .pipe(retry(1), catchError(this.httpError));
  }

  getMovies(skip: number, limit: number, type: string, genre: string): Observable<Movie[]> {
    const params = { skip, limit, type, genre }
    return this.httpClient
      .post<Movie[]>(this.serverUrl + '/movies', params)
      .pipe(retry(1), catchError(this.httpError));
  }

  getWatchList(watchListArray: number[]): Observable<Movie[]> {
    const params = { watchListArray }

    return this.httpClient
      .post<Movie[]>(this.serverUrl + '/watchlist', params)
      .pipe(retry(1), catchError(this.httpError));
  }

  getLatestMovie(limit: number): Observable<Movie[]> {
    const params = { limit }
    return this.httpClient
      .post<Movie[]>(this.serverUrl + '/latestMovies', params)
      .pipe(retry(1), catchError(this.httpError));
  }

  searchMovies(keyword: string): Observable<Movie[]> {
    return (
      this.httpClient
        .get<Movie[]>(this.serverUrl + '/search?query=' + keyword)
        // return this.httpClient.get<Movie[]>(this.serverUrl+'/movies?title_like='+keyword)
        .pipe(retry(1), catchError(this.httpError))
    );
  }

  getMoviesByLanguage(skip: number, limit: number, language: string): Observable<Movie[]> {
    const params = { skip, limit, language }
    return (
      this.httpClient
        .post<Movie[]>(this.serverUrl + '/language', params)
        .pipe(retry(1), catchError(this.httpError))
    );
  }

  //To handle error message
  httpError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code :${error.status}\nMessage :${error.message}`;
    }
    console.log(msg);
    return throwError(msg);
  }
}
