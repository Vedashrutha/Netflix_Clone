import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { BillDetails, User } from '../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { encryptData } from '../helpers/aesEncryption';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  userData: User = new User(
    '',
    '',
    '',
    0,
    '',
    '',
    [],
    new BillDetails(0, '', 0, '', '')
  );

  loginForm: FormGroup;
  loginError: boolean;
  errorMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    // Alternatively
    // const email = this.loginForm.controls.['email'].value;
    // const password = this.loginForm.controls.['password'].value;

    this.userService.getUserByEmailOrPhoneNumber(email).subscribe((response) => {
      this.userData = response;
      if (this.userData.uPass === password) {
        //console.log(element);
        this.loginError = false;

        let userId:string=encryptData(this.userData._id.toString())
        localStorage.setItem('userID', userId);

        let username:string=encryptData(this.userData.firstName)
        localStorage.setItem('userName', username);
  
        this.snackBar.open('Please wait while we fetch your data!', 'Close', {
          duration: 3000,
        });
        setTimeout(() => {
          this.snackBar.open('Logged in successfully!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/profiles']);
        }, 2000);
      } else {
        this.loginError = true;
        // return
      }
    });
    
  }
}
