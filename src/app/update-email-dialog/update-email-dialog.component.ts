import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { emailValidator } from '../helpers/dataValidator';
import { emailMatchValidator } from '../helpers/dataMatch';

@Component({
  selector: 'app-update-email-dialog',
  templateUrl: './update-email-dialog.component.html',
  styleUrls: ['./update-email-dialog.component.scss']
})
export class UpdateEmailDialogComponent {
  updateEmailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateEmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateEmailForm = this.fb.group({
      password: ['', Validators.required],
      newEmail: ['', [Validators.required, emailValidator()]],
      confirmEmail: ['', [Validators.required, emailValidator()]]
    }, { validators: emailMatchValidator });
  }

  

  onSubmit() {
    if (this.updateEmailForm.invalid) {
      return;
    }

    const password = this.updateEmailForm.value.password;
    const newEmail = this.updateEmailForm.value.newEmail;

    // Pass the updated email data back to the parent component
    this.dialogRef.close({ password, newEmail });
  }

  onCancel() {
    this.dialogRef.close();
  }
}

