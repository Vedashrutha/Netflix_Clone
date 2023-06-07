import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardNumber'
})
export class CardnumberPipe implements PipeTransform {

  transform(value: string | null): string {
    if (!value || value.length !== 16) {
      return value ?? ''; // Return the original value or an empty string if it's not a valid string of length 16
    }
    const last4Chars = value.slice(-4);
    const maskedChars = 'X'.repeat(value.length - 4);
    const maskedValue = maskedChars.replace(/(.{4})/g, '$1-');

    return maskedValue + last4Chars;
  }

}
