import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'password'
})
export class PasswordPipe implements PipeTransform {

  transform(value: string): string {
    const length = value.length;
    return '*'.repeat(length);
  }

}
