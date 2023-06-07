import { Component } from '@angular/core';
import { Movie } from '../models/movies';
import { MovieService } from '../services/movie.service';
import { Router } from '@angular/router';
import { decryptData } from '../helpers/aesEncryption';
import { User, Profile } from '../models/user';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tvshows',
  templateUrl: './tvshows.component.html',
  styleUrls: ['./tvshows.component.scss'],
})
export class TvshowsComponent {
  show: boolean;
  // arrData: Movie[] = [];
  categSeries: Movie[] = [];
  actionSeries: Movie[] = [];
  advSeries: Movie[] = [];
  horrorSeries: Movie[] = [];
  crimeSeries: Movie[] = [];
  dramaSeries: Movie[] = [];
  romanticSeries: Movie[] = [];

  isLoading: boolean = false; //For pagination loading
  skip: number = 1;
  limit: number = 6;
  genreSelected: string;
  type: string = 'tvshow';

  user: User;
  encUid = localStorage.getItem('userID') || '0'
  userId: string = decryptData(this.encUid)
  encPid = localStorage.getItem('profileID') || '0'
  profileID: number = parseInt(decryptData(this.encPid));
  profileDetails: Profile;

  constructor(private movieService: MovieService, private router: Router, private userService: UserService,private snackbar: MatSnackBar) {
    this.show = true;
  }

  ngOnInit() {

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

    this.movieService
      .getMovies(this.skip, this.limit, this.type, 'action')
      .subscribe((response) => {
        response.forEach((element) => {
          this.actionSeries.push(element);
        });
      });

    this.movieService
      .getMovies(this.skip, this.limit, this.type, 'adventure')
      .subscribe((data) => {
        data.forEach((element) => {
          this.advSeries.push(element);
        });
      });

    this.movieService
      .getMovies(this.skip, this.limit, this.type, 'horror')
      .subscribe((data) => {
        data.forEach((element) => {
          this.horrorSeries.push(element);
        });
      });

    this.movieService
      .getMovies(this.skip, this.limit, this.type, 'crime')
      .subscribe((data) => {
        data.forEach((element) => {
          this.crimeSeries.push(element);
        });
      });

    this.movieService
      .getMovies(this.skip, this.limit, this.type, 'drama')
      .subscribe((data) => {
        data.forEach((element) => {
          this.dramaSeries.push(element);
        });
      });

    this.movieService
      .getMovies(this.skip, this.limit, this.type, 'romantic')
      .subscribe((data) => {
        data.forEach((element) => {
          this.romanticSeries.push(element);
        });
      });
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

  onChangeType(evt: any) {
    this.genreSelected = evt.target.value;
    // console.log(genreSelected);
    if (this.genreSelected === 'all') {
      this.show = true;
    } else {
      this.show = false;
      this.showCustomisedMov(this.genreSelected);
    }
  }

  onChange(evt: any) {
    var sortType = evt.target.value;
    console.log(sortType);
    if (sortType === 'ascending') {
    }

    if (sortType === 'descending') {
    }
  }

  showCustomisedMov(genre: string) {
    if (genre === 'action') {
      this.categSeries = this.actionSeries;
    }
    if (genre === 'adventure') {
      this.categSeries = this.advSeries;
    }
    if (genre === 'horror') {
      this.categSeries = this.horrorSeries;
    }
    if (genre === 'crime') {
      this.categSeries = this.crimeSeries;
    }
    if (genre === 'drama') {
      this.categSeries = this.dramaSeries;
    }
    if (genre === 'romantic') {
      this.categSeries = this.romanticSeries;
    }
  }

  viewDetails(id: number) {
    // console.log("Content details");
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
