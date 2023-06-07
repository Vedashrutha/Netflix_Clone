import { Component } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movies';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BillDetails, Profile, User } from '../models/user';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { decryptData, encryptData } from '../helpers/aesEncryption';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  user: User = new User(
    '',
    '',
    '',
    0,
    '',
    '',
    [],
    new BillDetails(0, '', 0, '', '')
  );

  encryptedId=localStorage.getItem('userID') || '0'
  userId = decryptData(this.encryptedId)

  encProfileID=localStorage.getItem('profileID') || '0'
  profileID = parseInt(decryptData(this.encProfileID));

  profileDetails: Profile = new Profile(0, '', '', [], [], [], []);

  searchString: string = '';
  searchArray: Movie[] = [];

  constructor(
    private movieService: MovieService,
    private snackbar: MatSnackBar,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog){}

  ngOnInit() {
    this.userService.getUserById(this.userId).subscribe((data) => {
      this.user = data;

      this.fetchProfileDetails();
    });
  }

  fetchProfileDetails() {
    for (var i = 0; i < this.user.profile.length; i++) {
      if (this.user.profile[i]._id == this.profileID) {
        this.profileDetails = this.user.profile[i];
        break;
      }
    }
    this.user.profile.splice(i, 1);
    // console.log(this.user.profile.splice(i,1));
    //splice is used to add/remove items in the original array.
  }

  suggest(event: any) {
    this.searchString = event.target.value;
    this.movieService.searchMovies(this.searchString).subscribe(
      (response) => {
        this.searchArray = response;
      },
      (error) => {
        console.error(error);
      }
    )

    if (this.searchString === '') {
      this.closeSearch();
    }
  }

  closeSearch() {
    setTimeout(() => {
      this.searchArray = [];
    }, 100);
  }

  displayFn(movie: Movie): string {
    return movie && movie.title ? movie.title : '';
  }

  viewDetails(Id: number) {
    this.router.navigate(['/title/' + Id]);
  }

  selectProfile(profileId: number) {
     var encprofileId:string=encryptData(profileId.toString())
    localStorage.setItem('profileID',encprofileId)
    window.location.reload();
  }

  async delay(ms: number) {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), ms)).then(
      () => console.log('fired')
    );
  }

  //Signout function
  signOut() {
    localStorage.removeItem('userID');
    localStorage.removeItem('userName');
    localStorage.removeItem('profileID');

    this.openSnackBar('Signed Out Successfully', 'Dismiss');
    this.delay(1000).then((any) => {
      // window.location.replace('/home1')
      this.router.navigate(['/home1']);
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 4000,
      panelClass: ['custom-snackbar', 'custom-snackbar'],
    });
  }

  manageProfile(id: number) {
    this.router.navigate(['user/' + id]);
  }

  openNotificationDialog() {
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {

        console.log(data);
        
        // const pass = data.password;
        // const phoneNumber = data.newNumber;
        // this.changePassword(pass, phoneNumber)
      }

    });
  }
}
