export const validateMessages = {
    default: "Validation error on field ${label}",
    required: "Please input ${label}",
    enum: "${label} must be one of [${enum}]",
    whitespace: "${label} cannot be empty",
    date: {
      format: "${label} is invalid for format date",
      parse: "${label} could not be parsed as date",
      invalid: "${label} is invalid date",
    },      
    string: {
      min: "${label} must be at least ${min} characters",
      max: "${label} cannot be longer than ${max} characters",
      range: "${label} must be between ${min} and ${max} characters",
    },
    number: {
      len: "${label} must equal ${len}",
      min: "${label} cannot be less than ${min}",
      max: "${label} cannot be greater than ${max}",
      range: "${label} must be between ${min} and ${max}",
    },
    array: {
      len: "${label} must be exactly ${len} in length",
      min: "${label} cannot be less than ${min} in length",
      max: "${label} cannot be greater than ${max} in length",
      range: "${label} must be between ${min} and ${max} in length",
    },
    pattern: {
      mismatch: "${label} does not match pattern ${pattern}",
    },    
  };

