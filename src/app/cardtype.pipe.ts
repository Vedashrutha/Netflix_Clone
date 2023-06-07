import { Pipe, PipeTransform } from '@angular/core';
import * as creditCardType from 'credit-card-type';

@Pipe({
  name: 'cardtype'
})
export class CardtypePipe implements PipeTransform {

  transform(value: string): string {
    const cardTypes = creditCardType(value);
    if (cardTypes.length > 0) {
      return cardTypes[0].niceType;
    }
    return 'Unknown';
  }

}
