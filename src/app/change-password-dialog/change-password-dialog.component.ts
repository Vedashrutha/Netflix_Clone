import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { passwordValidator } from '../helpers/dataValidator';
import { passwordMatchValidator } from '../helpers/dataMatch';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent {
  changePasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.changePasswordForm = this.fb.group({
      password: ['', Validators.required],
      newPassword: ['', [Validators.required, passwordValidator()]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      return;
    }

    const password = this.changePasswordForm.value.password;
    const newPass = this.changePasswordForm.value.newPassword;
    this.dialogRef.close({ password, newPass });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
