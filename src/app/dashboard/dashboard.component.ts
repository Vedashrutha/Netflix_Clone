import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Movie } from '../models/movies';
import { MovieService } from '../services/movie.service';
import { Router } from '@angular/router';
import { Profile, User } from '../models/user';
import { decryptData } from '../helpers/aesEncryption';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  show: boolean;
  categMovies: Movie[] = [];
  continueWatching: Movie[] = [];
  actionMov: Movie[] = [];
  advMov: Movie[] = [];
  horrorMov: Movie[] = [];
  crimeMov: Movie[] = [];
  dramaMov: Movie[] = [];
  romanticMov: Movie[] = [];

  user: User;
  encUid = localStorage.getItem('userID') || '0'
  userId: string = decryptData(this.encUid)
  encPid = localStorage.getItem('profileID') || '0'
  profileID: number = parseInt(decryptData(this.encPid));
  profileDetails: Profile;

  isLoading: boolean = false; 
  skip: number = 1;
  limit: number = 6;
  genreSelected: string;
  type: string = 'movie';

  constructor(private movieService: MovieService, private router: Router, private userService: UserService, private snackbar: MatSnackBar) {
    this.show = true;
  }

  ngOnInit() {

    this.getData().then((data) => {
      this.user = data
      this.user.profile.forEach((profile) => {
        if (profile._id === this.profileID) {
          this.profileDetails = profile

          this.getWatchHistory().then((data) => {
            this.continueWatching = data
          }).catch((error) => {
            console.error('Error occurred:', error);
          });
        }
      })
    }).catch((error) => {
      console.error('Error occurred:', error);
    });

    this.movieService
      .getMovies(this.skip, this.limit, this.type, 'action')
      .subscribe((response) => {
        response.forEach((element) => {
          this.actionMov.push(element);
        });
      });

    this.movieService
      .getMovies(this.skip, this.limit, this.type, 'adventure')
      .subscribe((data) => {
        data.forEach((element) => {
          this.advMov.push(element);
        });
      });

    this.movieService
      .getMovies(this.skip, this.limit, this.type, 'crime')
      .subscribe((data) => {
        data.forEach((element) => {
          this.crimeMov.push(element);
        });
      });

    this.movieService
      .getMovies(this.skip, this.limit, this.type, 'drama')
      .subscribe((data) => {
        data.forEach((element) => {
          this.dramaMov.push(element);
        });
      });

    this.movieService
      .getMovies(this.skip, this.limit, this.type, 'horror')
      .subscribe((data) => {
        data.forEach((element) => {
          this.horrorMov.push(element);
        });
      });

    this.movieService
      .getMovies(this.skip, this.limit, this.type, 'romantic')
      .subscribe((data) => {
        data.forEach((element) => {
          this.romanticMov.push(element);
        });
      });
  }

  getData(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.userService.getUserById(this.userId).subscribe((response) => {
        resolve(response);
      },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getWatchHistory(): Promise<Movie[]> {
    return new Promise<Movie[]>((resolve, reject) => {
      this.movieService.getWatchList(this.profileDetails.watchhistory).subscribe((response) => {
        resolve(response);
      },
        (error) => {
          reject(error);
        }
      );
    });
  }

  @HostListener('scroll', ['$event'])
  onScroll(genre: string) {
    const container = document.querySelector('#container');
    if (container) {
      const containerWidth = container.clientWidth;
      console.log(window.innerWidth);
      console.log(containerWidth);


      const scrollOffset = window.pageYOffset;
      if (!this.isLoading && scrollOffset + window.innerWidth >= containerWidth
      ) {
        this.skip++;
        this.loadItems(genre);
      }
    }
  }

  private loadItems(genre: string) {
    // console.log('load called');
    this.isLoading = true;
    if (genre === "action") {
      this.movieService
        .getMovies(this.skip, this.limit, this.type, genre)
        .subscribe((data) => {
          data.forEach((ele) => {
            this.actionMov.push(ele);
          });
          this.isLoading = false;
        });
    }
    if (genre === "adventure") {
      this.movieService
        .getMovies(this.skip, this.limit, this.type, genre)
        .subscribe((data) => {
          data.forEach((ele) => {
            this.advMov.push(ele);
          });
          this.isLoading = false;
        });
    }

    if (genre === "horror") {
      this.movieService
        .getMovies(this.skip, this.limit, this.type, genre)
        .subscribe((data) => {
          data.forEach((ele) => {
            this.horrorMov.push(ele);
          });
          this.isLoading = false;
        });
    }

    if (genre === "crime") {
      this.movieService
        .getMovies(this.skip, this.limit, this.type, genre)
        .subscribe((data) => {
          data.forEach((ele) => {
            this.crimeMov.push(ele);
          });
          this.isLoading = false;
        });
    }

    if (genre === "drama") {
      this.movieService
        .getMovies(this.skip, this.limit, this.type, genre)
        .subscribe((data) => {
          data.forEach((ele) => {
            this.dramaMov.push(ele);
          });
          this.isLoading = false;
        });
    }

    if (genre === "romantic") {
      this.movieService
        .getMovies(this.skip, this.limit, this.type, genre)
        .subscribe((data) => {
          data.forEach((ele) => {
            this.romanticMov.push(ele);
          });
          this.isLoading = false;
        });
    }
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
