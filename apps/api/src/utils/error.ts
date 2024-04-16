import { ValidationError } from 'class-validator';

export function transformValidationErrors(
  error: ValidationError,
  parentProperty = '',
) {
  const transformedErrors = [];

  if (error.constraints) {
    const errorMessage = error.constraints[Object.keys(error.constraints)[0]];
    const errorProperty = parentProperty
      ? `${parentProperty}.${error.property}`
      : error.property;

    transformedErrors.push({
      errorMessage,
      errorProperty,
    });
  }

  if (error.children && error.children.length > 0) {
    for (const childError of error.children) {
      const childTransformedErrors = transformValidationErrors(
        childError,
        error.property,
      );
      transformedErrors.push(...childTransformedErrors);
    }
  }

  return transformedErrors;
}
