import { FormGroup } from '@angular/forms';

//Email and confirm email must Match
export function emailMatchValidator(form: FormGroup) {
  const newEmail = form.get('newEmail')?.value;
  const confirmEmail = form.get('confirmEmail')?.value;

  if (newEmail !== confirmEmail) {
    return { emailMismatch: true };
  } else {
    // if(confirmEmail){
    //   confirmEmail.setErrors(null);
    // }
    return null;
  }
}

//password and confirm password must Match
export function passwordMatchValidator(form: FormGroup) {

    const oldPassword = form.get('password')?.value;
    const newPassword = form.get('newPassword')?.value;

    if(oldPassword===newPassword){
      return { oldPAndNewPMatch: true}
    }

    const confirmPassword = form.get('confirmPassword')?.value;
  
    if (newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }