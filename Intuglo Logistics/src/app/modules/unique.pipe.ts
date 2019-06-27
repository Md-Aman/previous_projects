import { Pipe, PipeTransform } from '@angular/core';
import {Injectable} from '@angular/core'

@Pipe({
    name: 'unique'
})
@Injectable()
export class UniquePipe implements PipeTransform {
    transform(items: any[], field : string): any[] {

        if (!items) return [];
        var flags = [], output = [], l = items.length, i

        for( i=0; i<l; i++) {
            if( flags[items[i][field]]) continue;
            flags[items[i][field]] = true;
            output.push(items[i]);
        }

        return output
    }
}