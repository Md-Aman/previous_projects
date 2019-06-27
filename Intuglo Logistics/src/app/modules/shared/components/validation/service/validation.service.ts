export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any, patternValue?: any) {
        let config = {
            'required': 'Required',
            'minlength': `Minimum length ${validatorValue.requiredLength}`,
            'email': 'Invalid email address',
            'pattern': `Invalid pattern ( ${patternValue} )`
        };
        return config[validatorName];
    }
}