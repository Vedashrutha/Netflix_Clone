import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { passwordMatchValidator } from '../helpers/dataMatch';
import { passwordValidator, phoneNumberValidator } from '../helpers/dataValidator';

@Component({
  selector: 'app-change-phone-number-dialog',
  templateUrl: './change-phone-number-dialog.component.html',
  styleUrls: ['./change-phone-number-dialog.component.scss'],
})
export class ChangePhoneNumberDialogComponent {
  changePhoneNumber: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.changePhoneNumber = this.fb.group(
      {
        password: ['', Validators.required],
        phoneNumber: ['', [Validators.required, phoneNumberValidator()]],
      },
      { validators: passwordMatchValidator }
    );
  }

  onSubmit() {
    if (this.changePhoneNumber.invalid) {
      return;
    }

    const password = this.changePhoneNumber.value.password;
    const newNumber = parseInt(this.changePhoneNumber.value.phoneNumber, 10);
    this.dialogRef.close({ password, newNumber });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
