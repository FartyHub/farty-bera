import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const ACCEPTABLE_CHAR_SET = /^$|^[a-zA-Z0-9 _.,!?\-@#/₱$%^&*[\]()+Ññ:;'\n]+$/;

@ValidatorConstraint({ async: false })
export class IsAlphanumericCommonConstraint
  implements ValidatorConstraintInterface
{
  validate(text: string): boolean {
    if (text === '') {
      return true;
    }

    return ACCEPTABLE_CHAR_SET.test(text);
  }

  defaultMessage(): string {
    return 'Text contains forbidden characters';
  }
}

export function IsAlphanumericCommon(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      constraints: [],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: IsAlphanumericCommonConstraint,
    });
  };
}
