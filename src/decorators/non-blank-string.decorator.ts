import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStringNotBlank(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsStringNotBlank',
            target: object.constructor,
            propertyName: propertyName,
            options: { message: 'A string must not be blank', ...validationOptions },
            validator: {
                validate(value: any) {
                    if (value[0] === ' ') {
                        for (let i of value) {
                            if (i !== ' ') {
                                return true;
                            }
                        }
                        return false;
                    }
                    return true;
                }
            },
        });
    };
}
