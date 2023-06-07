import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { emailValidator } from '../helpers/dataValidator';

@Component({
  selector: 'app-home1',
  templateUrl: './home1.component.html',
  styleUrls: ['./home1.component.scss'],
})
export class Home1Component {
  newForm: FormGroup;
  loginError: boolean = false;
  submitted: boolean = false;
  resp: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.newForm = this.formBuilder.group({
      email: ['', [Validators.required, emailValidator()]],
    }, { validators: emailValidator });
  }

  get f() {
    return this.newForm.controls;
  }

  onSubmit() {
    if (this.newForm.invalid) {
      return;
    }

    var userMail = this.newForm.value.email;
    this.userService.checkEmail(userMail).subscribe((response) => {
      this.resp = JSON.parse(response)
      if (this.resp.exists) {
        this.loginError = true;
      }
      else {
        this.loginError = false
        this.router.navigate(['signup/' + userMail]);
      }
    })
  }

}
