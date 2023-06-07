import { Component } from '@angular/core';
import { BillDetails, User } from '../models/user';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { decryptData } from '../helpers/aesEncryption';

@Component({
  selector: 'app-manageprofile',
  templateUrl: './manageprofile.component.html',
  styleUrls: ['./manageprofile.component.scss'],
})
export class ManageprofileComponent {

  encId=localStorage.getItem('userID')|| '0'
  userId:string=decryptData(this.encId)

  userData = new User('', '', '', 0, '', '', [],new BillDetails(0,'',0,'',''));
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.getUserById(this.userId).subscribe((response) => {
      this.userData = response;
    });
  }

  selectProfile(profileId: number) {
    this.router.navigate(['edit/'+profileId]);
  }
}
