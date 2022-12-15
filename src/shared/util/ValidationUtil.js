export const isValid = (form) => {
    const violations = form.errors;
    if (Array.isArray(violations) && violations.length > 0) {
      return false;
    }
    return true;
  };