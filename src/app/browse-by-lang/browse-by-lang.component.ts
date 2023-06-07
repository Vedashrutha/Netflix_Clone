import { Component } from '@angular/core';
import { Movie } from '../models/movies';
import { Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { decryptData } from '../helpers/aesEncryption';
import { User, Profile } from '../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-browse-by-lang',
  templateUrl: './browse-by-lang.component.html',
  styleUrls: ['./browse-by-lang.component.scss'],
})
export class BrowseByLangComponent {

  kannadaMovies: Movie[] = [];
  englishMovies: Movie[] = [];
  hindiMovies: Movie[] = [];
  tamilMovies: Movie[] = [];
  teluguMovies: Movie[] = [];

  isLoading: boolean = false;
  skip: number = 1;
  limit: number = 6;

  user: User;
  encUid = localStorage.getItem('userID') || '0'
  userId: string = decryptData(this.encUid)
  encPid = localStorage.getItem('profileID') || '0'
  profileID: number = parseInt(decryptData(this.encPid));
  profileDetails: Profile;

  constructor(private movieService: MovieService, private router: Router, private userService: UserService, private snackbar: MatSnackBar) { }
  ngOnInit(): void {

    this.getData().then((data) => {
      this.user = data
      this.user.profile.forEach((profile) => {
        if (profile._id === this.profileID) {
          this.profileDetails = profile

        }
      })
    }).catch((error) => {
      console.error('Error occurred:', error);
    });

    this.movieService.getMoviesByLanguage(this.skip, this.limit, 'kannada').subscribe((response) => {
      this.kannadaMovies = response
    })

    this.movieService.getMoviesByLanguage(this.skip, this.limit, 'english').subscribe((response) => {
      this.englishMovies = response
    })

    this.movieService.getMoviesByLanguage(this.skip, this.limit, 'hindi').subscribe((response) => {
      this.hindiMovies = response

    })

    this.movieService.getMoviesByLanguage(this.skip, this.limit, 'tamil').subscribe((response) => {
      this.tamilMovies = response
    })

    this.movieService.getMoviesByLanguage(this.skip, this.limit, 'telugu').subscribe((response) => {
      this.teluguMovies = response
    })

  }

  getData(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.userService.getUserById(this.userId).subscribe((response) => {
        resolve(response);
        //   this.user = response
      },
        (error) => {
          reject(error);
        }
      );
    });
  }


  viewDetails(id: number) {
    this.router.navigate(['title/' + id]);
  }

  openPlayer(itemId: number) {
    this.router.navigate(['/play/' + itemId])
  }

  addToWatchList(id: number) {
    if (this.profileDetails.watchlist.includes(id)) {
      this.openSnackBar('Already added to Watchlist', 'Dismiss');
    }
    else {
      this.profileDetails.watchlist.push(id)
      this.openSnackBar('Added to Watchlist', 'Dismiss');
      this.updateProfileData();
    }
  }

  isItemInArray(item: number): boolean {
    return this.profileDetails.watchlist.includes(item);
  }

  isLiked(item: number): boolean {
    return this.profileDetails.liked.includes(item);
  }

  addToLikes(id: number) {
    if (this.profileDetails.liked.includes(id)) {
      this.openSnackBar('This type of contents will be shown', 'Dismiss');
    }
    else {
      this.profileDetails.watchlist.push(id)
      this.openSnackBar('This type of contents will be shown', 'Dismiss');
      this.updateProfileData();
    }
  }

  addToDisLikes(id: number) {
    if (!this.profileDetails.disliked.includes(id)) {
      this.profileDetails.watchlist.push(id)
      this.openSnackBar('This type of contents will be shown', 'Dismiss');
      this.updateProfileData();
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 4000,
      panelClass: ['custom-snackbar', 'custom-snackbar'],
    });
  }

  updateProfileData() {
    for (let i = 0; i < this.user.profile.length; i++) {
      if (this.user.profile[i]._id === this.profileID) {
        this.user.profile[i] = this.profileDetails
        break;
      }
    }
    this.userService.updateUser(this.user).subscribe((response) => {

    })
  }
}
