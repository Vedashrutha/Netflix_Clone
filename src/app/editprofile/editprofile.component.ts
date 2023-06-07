import { Component } from '@angular/core';
import { BillDetails, Profile, User } from '../models/user';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { decryptData } from '../helpers/aesEncryption';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss'],
})
export class EditprofileComponent {

  encUid=localStorage.getItem('userID')|| '0'
  userId:string=decryptData(this.encUid)


  // decrypt this
  profileId:number=0
  userData: User = new User('', '', '', 0, '', '', [],new BillDetails(0,'',0,'',''));
  editProfile: Profile = new Profile(0, '', '', [], [], [], []);
  editForm: FormGroup;
  submitted: boolean = false;

  images = [
    { id: 1, source: '../../assets/img/avatars/avatar1.jpg'},
    { id: 2, source: '../../assets/img/avatars/avatar2.jpg'},
    { id: 3, source: '../../assets/img/avatars/avatar3.jpg'},
    { id: 3, source: '../../assets/img/avatars/avatar4.jpg'},
  ];

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar,
    private router:Router
  ) {
    this.editForm = this.formBuilder.group({
      profileName: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((prms) => {
      this.profileId = parseInt(prms['id']);

      this.userService.getUserById(this.userId).subscribe((data) => {
        this.userData = data;
        // console.log(this.userData);

        this.userData.profile.forEach((profile) => {
          if (profile._id === this.profileId) {
            this.editProfile = profile;
          }
        });
        // console.log(this.editProfile);
      });
    });
  }

  get f() {
    return this.editForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.editForm.invalid) {
      return;
    }
    let flag = false;
    // let id:number
    let profileName = this.editForm.value.profileName;
    let avatar = this.editProfile.avatar;
    let watchlist = this.editProfile.watchlist;
    let watchhistory = this.editProfile.watchhistory;
    let liked = this.editProfile.liked;
    let disliked = this.editProfile.disliked;

    if(profileName && avatar && watchlist && watchhistory && liked && disliked){
      this.editProfile = new Profile(
        this.profileId,
        profileName,
        avatar,
        watchlist,
        watchhistory,
        liked,
        disliked
      );
    }
    this.updateProfile();
    this.openSnackBar("profile updated","Dismiss")
    this.router.navigate(['/manage'])
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
  }

  updateProfile() {
    for (let i = 0; i < this.userData.profile.length; i++) {
      if (this.userData.profile[i]._id === this.editProfile._id) {
        this.userData.profile[i]=this.editProfile
      }
    }

    this.userService.updateUser(this.userData).subscribe((response)=>{
      
    })
  }

  deleteProfile(profileId: number) {
    for (var i = 0; i < this.userData.profile.length; i++) {
      if (this.userData.profile[i]._id === profileId) {
        break;
      }
    }
    this.userData.profile.splice(i,1)
    this.userService.updateUser(this.userData).subscribe((response)=>{
    })
    this.openSnackBar("Profile deleted Successfully","Dismiss")
    this.router.navigate(['/manage'])
  }


  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 4000,
      panelClass: ['custom-snackbar', 'custom-snackbar']
    });
  }

  setProfileImage(imgUrl:string){
    this.editProfile.avatar=imgUrl
    this.updateProfile()
    
  }
}
