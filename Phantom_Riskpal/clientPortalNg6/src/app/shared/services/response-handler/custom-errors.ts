import {ErrorMessage} from "ng-bootstrap-form-validation";
 
export const CUSTOM_ERRORS: ErrorMessage[] = [
  {
    error: 'email',
    format: emailFormat
  },
  {
    error: 'pattern',
    format: patternFormat
  },
  {
    error: 'minlength',
    format: minLengthFormat
  },
  {
    error: 'maxlength',
    format: (label, error) => `Please select between 2-200 characters`
  }
];
export function patternFormat(label: string, error: any) {
  if ( label.toLowerCase() == 'email address' || label.toLowerCase() == 'email' ) {
    return `${label.toUpperCase()} is not valid.`;
  } else {
    return `No special characters are supported in a ${label.toUpperCase()}.`;
  }
  
}
export function minLengthFormat(label: string, error: any): string {
 
  return `Please select between 2-200 characters`;
}

export function emailFormat(label: string, error: any): string {
  return `Email Address is not valid.`;
}