import { Component, ElementRef, HostListener } from '@angular/core';
import { Movie } from '../models/movies';
import { MovieService } from '../services/movie.service';
import { Router } from '@angular/router';
import { Profile, User } from '../models/user';
import { UserService } from '../services/user.service';
import { decryptData } from '../helpers/aesEncryption';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent {
  show: boolean;
  categMovies: Movie[] = [];
  actionMov: Movie[] = [];
  advMov: Movie[] = [];
  horrorMov: Movie[] = [];
  crimeMov: Movie[] = [];
  dramaMov: Movie[] = [];
  romanticMov: Movie[] = [];

  isLoading: boolean = false; //For pagination loading
  skip: number = 1;
  limit: number = 6;
  genreSelected: string;
  type: string = 'movie';

  user: User;
  encUid = localStorage.getItem('userID') || '0'
  userId: string = decryptData(this.encUid)
  encPid = localStorage.getItem('profileID') || '0'
  profileID: number = parseInt(decryptData(this.encPid));
  profileDetails: Profile;
  
  constructor(private elementRef: ElementRef,private movieService: MovieService, private router: Router,private userService:UserService,private snackbar: MatSnackBar) {
    this.show = true;
  }  

  ngOnInit(): void {
    this.getData().then((data)=>{
      this.user=data
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
          this.actionMov.push(element);
        });
      });

      this.movieService
      .getMovies(this.skip, this.limit, this.type, 'adventure')
      .subscribe((response) => {
        response.forEach((element) => {
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
        //   this.user = response
      },
        (error) => {
          reject(error);
        }
      );
    });
  }

  @HostListener('scroll', ['$event'])
  onScroll(genre:string) {
    const container = document.querySelector('#container');
    if (container) {
      const containerWidth = container.clientWidth;
      // console.log(window.innerWidth);
      // console.log(containerWidth);
      
      
      const scrollOffset = window.pageYOffset;
      if (!this.isLoading && scrollOffset + window.innerWidth >= containerWidth
      ) {
        this.skip++;
        this.loadItems(genre);
      }
    }
  }

  private loadItems(genre:string) {
    this.isLoading = true;
    if(genre==="action"){
      this.movieService
      .getMovies(this.skip, this.limit, this.type, genre)
      .subscribe((data) => {
        data.forEach((ele) => {
          this.actionMov.push(ele);
          // console.log(this.actionMov);
          
        });
        this.isLoading = false;
      });
    }
    if(genre==="adventure"){
      this.movieService
      .getMovies(this.skip, this.limit, this.type, genre)
      .subscribe((data) => {
        data.forEach((ele) => {
          this.advMov.push(ele);
        });
        this.isLoading = false;
      });
    }

    if(genre==="horror"){
      this.movieService
      .getMovies(this.skip, this.limit, this.type, genre)
      .subscribe((data) => {
        data.forEach((ele) => {
          this.horrorMov.push(ele);
        });
        this.isLoading = false;
      });
    }

    if(genre==="crime"){
      this.movieService
      .getMovies(this.skip, this.limit, this.type, genre)
      .subscribe((data) => {
        data.forEach((ele) => {
          this.crimeMov.push(ele);
        });
        this.isLoading = false;
      });
    }

    if(genre==="drama"){
      this.movieService
      .getMovies(this.skip, this.limit, this.type, genre)
      .subscribe((data) => {
        data.forEach((ele) => {
          this.dramaMov.push(ele);
        });
        this.isLoading = false;
      });
    }

    if(genre==="romantic"){
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


  onChangeType(evt: any) {
    this.genreSelected = evt.target.value;
    if (this.genreSelected === 'all') {
      this.show = true;
    } else {
      this.show = false;
      this.showCustomisedMov(this.genreSelected);
    }
  }

  showCustomisedMov(genre: string) {
    if (genre === 'action') {
      this.categMovies = this.actionMov;
    }
    if (genre === 'adventure') {
      this.categMovies = this.advMov;
    }
    if (genre === 'horror') {
      this.categMovies = this.horrorMov;
    }
    if (genre === 'crime') {
      this.categMovies = this.crimeMov;
    }
    if (genre === 'drama') {
      this.categMovies = this.dramaMov;
    }
    if (genre === 'romantic') {
      this.categMovies = this.romanticMov;
    }
  }

  // Function to view Movie Details
  viewDetails(id: number) {
    this.router.navigate(['title/' + id]);
  }

  openPlayer(itemId: number) {
    this.router.navigate(['/play/' + itemId])
  }
  
  addToWatchList(id: number) {
    if(this.profileDetails.watchlist.includes(id)){
      this.openSnackBar('Already added to Watchlist', 'Dismiss');
    }
    else{
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
    if(this.profileDetails.liked.includes(id)){
      this.openSnackBar('This type of contents will be shown', 'Dismiss');
    }
    else{
      this.profileDetails.watchlist.push(id)
      this.openSnackBar('This type of contents will be shown', 'Dismiss');
      this.updateProfileData();
    }
  }

  addToDisLikes(id: number) {
    if(!this.profileDetails.disliked.includes(id)){
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

  updateProfileData(){
    for(let i=0;i<this.user.profile.length;i++){
      if(this.user.profile[i]._id===this.profileID){
        this.user.profile[i]=this.profileDetails
        break;
      }
    }
    this.userService.updateUser(this.user).subscribe((response)=>{

    })
  }
}
