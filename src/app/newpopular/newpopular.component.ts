import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { decryptData } from '../helpers/aesEncryption';
import { Movie } from '../models/movies';
import { User, BillDetails, Profile } from '../models/user';
import { MovieService } from '../services/movie.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-newpopular',
  templateUrl: './newpopular.component.html',
  styleUrls: ['./newpopular.component.scss']
})
export class NewpopularComponent {
  user: User = new User('', '', '', 0, '', '', [], new BillDetails(0, '', 0, '', ''));
  newPopular: Movie[] = [];
  encProfileID = localStorage.getItem('profileID') || '0';
  profileID = parseInt(decryptData(this.encProfileID))
  profileDetails: Profile;
  i: number = 0
  limit:number=10
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
    });

    this.movieService.getLatestMovie(this.limit).subscribe((response) => {
      this.newPopular = response

      console.log(this.newPopular);
      
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

  // isItemInArray(item: number): boolean {
  //   return this.profileDetails.watchlist.includes(item);
  // }

  isLiked(item: number): boolean {
    return this.profileDetails.liked.includes(item);
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
