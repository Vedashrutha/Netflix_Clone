import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BillDetails, Profile, User } from '../models/user';
import { UserService } from '../services/user.service';
import { decryptData } from '../helpers/aesEncryption';

@Component({
  selector: 'app-newprofile',
  templateUrl: './newprofile.component.html',
  styleUrls: ['./newprofile.component.scss'],
})
export class NewprofileComponent {
  encUid=localStorage.getItem('userID')|| '0'
  userId:string=decryptData(this.encUid)

  userData: User = new User('', '', '', 0, '', '', [],new BillDetails(0,'',0,'',''));
  newProfile: Profile = new Profile(0, '', '', [], [], [], []);
  profileForm: FormGroup;
  submitted: boolean = false;
  newID:number=0

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackbar: MatSnackBar
  ) {
    this.profileForm = this.formBuilder.group({
      profileName: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.userService.getUserById(this.userId).subscribe((data) => {
      this.userData = data;
    });
  }
  get f() {
    return this.profileForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }

    if (this.userData.profile.length <= 4) {
      this.newID = this.generateId();
      var imageID = Math.floor(Math.random() * (5 - 1) + 1);
      var pName = this.profileForm.value.profileName;
      var flag = false;
      // console.log(pName);
      var avatar = '../../assets/img/avatars/avatar' + imageID + '.jpg';

      if (pName && avatar) {
        this.newProfile = new Profile(this.newID,pName,avatar,[],[],[],[]);
        this.userData.profile.push(this.newProfile);
        this.userService.updateUser(this.userData).subscribe((response) => {
          this.openSnackBar('New profile created successfully', 'Dismiss');
          this.router.navigate(['/profiles'])
        });
      }
    } else {
      this.openSnackBar("Maximum profiles created for this account","Dismiss")
    }
  }

  // To generate ID
  generateId() {
    var maxId = 0;
    this.userData.profile.forEach((profile) => {
      if (maxId < profile._id) {
        maxId = profile._id;
      }
    });
    return maxId + 1;
  }
  
  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration:2000,
      panelClass: ['custom-snackbar', 'custom-snackbar'],
    });
  }
}
