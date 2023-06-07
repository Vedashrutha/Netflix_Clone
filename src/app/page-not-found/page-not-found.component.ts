import { Component } from '@angular/core';
import { Profile, User } from '../models/user';
import { decryptData } from '../helpers/aesEncryption';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {

  constructor(private router: Router, private userService: UserService) { }
  user: User;
  encUid = localStorage.getItem('userID') || '0'
  userId: string = decryptData(this.encUid)
  encPid = localStorage.getItem('profileID') || '0'
  profileID: number = parseInt(decryptData(this.encPid));

  ngOnInit() {
    this.userService.getUserById(this.userId).subscribe((response) => {
      this.user = response
    })
  }

  redirect() {
    if (this.user) {
      this.router.navigate(['/home2'])
    }
    else {
      this.router.navigate(['/home1'])
    }
  }
}
