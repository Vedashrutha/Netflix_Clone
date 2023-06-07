import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

// password Validation
export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    const regex =
      /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*()])[A-Za-z0-9!@#$%^&*()]{8,}$/;

    if (!regex.test(password)) {
      return { invalidPassword: true };
    }
    return null;
  };
}

// email Validation
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!regex.test(email)) {
      return { invalidEmail: true };
    }

    return null;
  };
}

export function cardValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cardNumber = control.value;
    const regex = /^[0-9]{12,19}$/;

    if (!regex.test(cardNumber)) {
      return { invalidCardNumber: true };
    }
    return null;
  };
}

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phoneNumber = control.value;
    const phoneNumberString = phoneNumber.toString();
    const regex = /^\d{10}$/;
    
    if (!regex.test(phoneNumberString)) {
      return { invalidPhoneNumber: true };
    }

    return null;
  };
}