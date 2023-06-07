import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Movie } from '../models/movies';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { decryptData } from '../helpers/aesEncryption';
import { User, Profile } from '../models/user';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-viewcontent',
  templateUrl: './viewcontent.component.html',
  styleUrls: ['./viewcontent.component.scss'],
})
export class ViewcontentComponent {
  hideControls = false;
  timeoutId: any;

  @ViewChild('trailerVideo') trailerVideoRef!: ElementRef;

  idObtained: number = 0;
  contentData: Movie = new Movie(0, '', '', [], 0, 0, [], [], '', '', 0, '', '', '');

  user: User;
  encUid = localStorage.getItem('userID') || '0'
  userId: string = decryptData(this.encUid)
  encPid = localStorage.getItem('profileID') || '0'
  profileID: number = parseInt(decryptData(this.encPid));
  profileDetails: Profile;
  moreLikeThisData: Movie[] = [];
  isMuted: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private userService: UserService,
    private snackbar:MatSnackBar
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((prms) => {
      this.idObtained = parseInt(prms['id']);
      this.movieService.getMovieById(this.idObtained).subscribe((data) => {
        this.contentData = data;
        // this.getMore(this.contentData);
        // this.moreLikeThisSortedData.push(this.removeDuplicates(this.moreLikeThisData))
      });
    });

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

  // getMore(data: Movie) {
  // for (let i = 0; i < data.genre.length; i++) {
  //   for (let j = 0; j < this.movData.length; j++) {
  //     if (this.movData[j].genre.includes(data.genre[i])) {
  //       if (data.id == this.movData[j].id) {
  //         // console.log("Includes");
  //         continue;
  //       } else if (this.moreLikeThisData.includes(this.movData[j])) {
  //         continue;
  //       } else {
  //         this.moreLikeThisData.push(this.movData[j]);
  //       }
  //     }
  //   }
  // }
  // }

  toggleMute(){
    const video=this.trailerVideoRef.nativeElement;
    video.muted = !video.muted;
    this.isMuted = video.muted;
  }

  muteVideo() {
    const video: HTMLVideoElement = this.trailerVideoRef.nativeElement;
    video.muted = true;
  }

  viewDetails(id: number) {
    this.router.navigate(['title/' + id]);
  }

  openPlayer(itemId: number) {
    this.addToWatchHistory(itemId)
    this.router.navigate(['/play/' + itemId])
  }

  addToWatchHistory(item: number) {
    if (!this.profileDetails.watchhistory.includes(item)) {
      this.profileDetails.watchhistory.push(item)
    }
    this.updateProfileData()
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
