import { Constants } from '../../util/constants'
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'date-format-pipe'
})
export class PrintDateFormatPipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return super.transform(value, Constants.PRINT_DATE_FORMAT);
  }

}
