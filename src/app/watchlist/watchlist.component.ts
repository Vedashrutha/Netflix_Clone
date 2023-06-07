import { Component } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movies';
import { UserService } from '../services/user.service';
import { BillDetails, Profile, User } from '../models/user';
import { Router } from '@angular/router';
import { decryptData } from '../helpers/aesEncryption';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss'],
})
export class WatchlistComponent {
  user: User = new User('', '', '', 0, '', '', [], new BillDetails(0, '', 0, '', ''));
  watchListData: Movie[] = [];
  encProfileID = localStorage.getItem('profileID') || '0';
  profileID = parseInt(decryptData(this.encProfileID))
  i: number = 0

  profile: Profile

  encUid = localStorage.getItem('userID') || '0'
  userId: string = decryptData(this.encUid)


  constructor(
    private movieService: MovieService,
    private userService: UserService,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.userService.getUserById(this.userId).subscribe((data) => {
      this.user = data;

      this.fetchWatchListDetails();
    });
  }

  fetchWatchListDetails() {
    var movieIDs: number[] = [];

    for (this.i = 0; this.i < this.user.profile.length; this.i++) {
      if (this.user.profile[this.i]._id == this.profileID) {
        this.profile = this.user.profile[this.i]

        this.profile.watchlist.forEach((movieId) => {
          movieIDs.push(movieId)
        });
        break;
      }
    }

    this.movieService.getWatchList(movieIDs).subscribe((response) => {
      this.watchListData = response
    })
  }

  viewDetails(id: number) {
    this.router.navigate(['title/' + id]);
  }

  openPlayer(itemId: number) {
    this.router.navigate(['/play/' + itemId])
  }

  deleteFromWatchList(id: number) {
    const index = this.profile.watchlist.indexOf(id);
    if (index !== -1) {
      this.profile.watchlist.splice(index, 1);
    }
    // modify the current watchlistdata array to show data there itself without refreshing 
    for (let j = 0; j < this.watchListData.length; j++) {
      if (this.watchListData[j].id === id) {
        this.watchListData.splice(j, 1)
        break;
      }
    }

    // update the user
    this.openSnackBar("Item removed from watchlist", "Dismiss")
    this.updateProfileData();
  }

  addToLikes(id: number) {
    if (this.profile.liked.includes(id)) {
      this.openSnackBar('This type of contents will be shown', 'Dismiss');
    }
    else {
      this.profile.watchlist.push(id)
      this.openSnackBar('This type of contents will be shown', 'Dismiss');
      this.updateProfileData();
    }
  }

  addToDisLikes(id: number) {
    if (!this.profile.disliked.includes(id)) {
      this.profile.watchlist.push(id)
      this.openSnackBar('This type of contents will be shown', 'Dismiss');
      this.updateProfileData();
    }
  }


  updateProfileData() {
    for (let i = 0; i < this.user.profile.length; i++) {
      if (this.user.profile[i]._id === this.profileID) {
        this.user.profile[i] = this.profile
        break;
      }
    }
    this.userService.updateUser(this.user).subscribe((response) => {

    })
  }

  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 4000,
      panelClass: ['custom-snackbar', 'custom-snackbar'],
    });
  }
}
