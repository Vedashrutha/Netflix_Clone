import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User, Profile, BillDetails } from '../models/user';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateEmailDialogComponent } from '../update-email-dialog/update-email-dialog.component';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { decryptData, encryptData } from '../helpers/aesEncryption';
import * as creditCardType from 'credit-card-type';
import { ChangePhoneNumberDialogComponent } from '../change-phone-number-dialog/change-phone-number-dialog.component';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  user: User = new User('', '', '', 0, '', '', [], new BillDetails(0, '', 0, '', ''));

  encUid = localStorage.getItem('userID') || '0'
  userId: string = decryptData(this.encUid)

  encPid = localStorage.getItem('profileID') || '0'
  profileID: number = parseInt(decryptData(this.encPid));

  profileDetails: Profile = new Profile(0, '', '', [], [], [], []);
  profiles: Profile[] = [];

  cardImage: string

  submitted: boolean = false;

  constructor(
    private snackbar: MatSnackBar,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userService.getUserById(this.userId).subscribe((data) => {
      this.user = data;

      this.user.profile.forEach((profile) => {
        this.profiles.push(profile);
      });

      this.fetchProfileDetails();
      this.getCardImage();
    });
  }

  openUpdateEmailDialog() {
    const dialogRef = this.dialog.open(UpdateEmailDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const password = result.password;
        const newEmail = result.newEmail;
        this.updateEmail(password, newEmail)

      }
    });
  }

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {

        const pass = data.password;
        const newPass = data.newPass;
        this.changePassword(pass, newPass)
      }

    });
  }

  openChangePhoneNumberDialog() {
    const dialogRef = this.dialog.open(ChangePhoneNumberDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {

        const pass = data.password;
        const phoneNumber = data.newNumber;
        this.changePassword(pass, phoneNumber)
      }

    });
  }

  // Email Update ->start
  updateEmail(password: string, email: string) {
    if (password === this.user.uPass) {
      this.user.eMail = email;
      this.userService.updateUser(this.user).subscribe((data) => { });
      setTimeout(() => {
        this.router.navigate(['/account']);
        this.openSnackBar('Email address changed successfully ', 'Dismiss');
      }, 1000);
    }
    else {
      this.openSnackBar('Wrong Password', 'Dismiss');
    }
  }
  // Email Update ->end

  //password update start
  changePassword(password: string, newPass: string) {
    if (password === this.user.uPass) {
      this.user.uPass = newPass;
      this.userService.updateUser(this.user).subscribe((data) => { });
      setTimeout(() => {
        this.router.navigate(['/account']);
        this.openSnackBar('Password updated successfully ', 'Dismiss');
      }, 1000);
    }
    else {
      this.openSnackBar('Wrong Password', 'Dismiss');
    }
  }

  updatePhoneNumber(password: string, phoneNumber: number) {
    if (password === this.user.uPass) {
      this.user.phoneNumber = phoneNumber;
      this.userService.updateUser(this.user).subscribe((data) => { });
      setTimeout(() => {
        this.router.navigate(['/account']);
        this.openSnackBar('Phone Number changed successfully ', 'Dismiss');
      }, 1000);
    }
    else {
      this.openSnackBar('Wrong Password', 'Dismiss');
    }
  }
  //password update end

  fetchProfileDetails() {
    for (var i = 0; i < this.user.profile.length; i++) {
      if (this.user.profile[i]._id == this.profileID) {
        this.profileDetails = this.user.profile[i];
        break;
      }
    }
    this.user.profile.slice(i, i + 1);
    //splice is used to add/remove items in the original array.
    //slice returns new Array
  }

  selectProfile(profileId: number) {
    var encId = encryptData(profileId.toString())
    localStorage.setItem('profileID', encId.toString());
    window.location.reload();
  }

  async delay(ms: number) {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), ms)).then(
      () => console.log('fired')
    );
  }

  getCardImage() {
    const cardTypes = creditCardType(this.user.billingDetails.cardNumber);
    if (cardTypes.length > 0) {
      this.cardImage="../../assets/img/cards/"+cardTypes[0].niceType+'.svg';
    }
  }

  //Signout function
  signOut() {
    localStorage.removeItem('userID');
    localStorage.removeItem('userName');
    localStorage.removeItem('profileID');

    this.openSnackBar('Signed Out Successfully', 'Dismiss');
    this.delay(1000).then((any) => {
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

  generatePDF() {
    const docDefinition = {
      content: [
        { text: 'Billing Details', style: 'header' },
        { text: 'First Name: ' + this.user.firstName },
        { text: 'Last Name: ' + this.user.lastName },
        { text: 'Registered Email: ' + this.user.eMail },
        { text: 'Card Number: ' + this.user.billingDetails.cardNumber },
        { text: 'Plan Name: ' + this.user.billingDetails.planName },
        { text: 'Plan Price: ' + this.user.billingDetails.planPrice },
        { text: 'Purchased On: ' + this.user.billingDetails.purchasedOn },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };
  
    pdfMake.createPdf(docDefinition).download(this.user.firstName+'_netflix_inovice.pdf');
  }

  deleteAccount(){
    this.userService.deleteUser(this.userId).subscribe((response)=>{
      
    })
    
  }
}

