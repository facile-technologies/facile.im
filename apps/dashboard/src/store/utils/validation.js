export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

// Password Validation 
export const validatePassword = (password) => {
  const conditions = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numberOrSymbol: /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const isValid = Object.values(conditions).every(Boolean);

  return { conditions, isValid };
};

export const validateForm = (data, typeOf = {}) => {
  const errors = {};

  Object.entries(typeOf).forEach(([field, rule]) => {
    const value = data[field];
    if (rule.required && (!value || value.trim() === "")) {
      errors[field] = `${rule.label || field} is required`;
      return;
    }
    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
      return;
    }

    if (rule.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field] = "Please enter a valid email address";
      return;
    }
    if (rule.type === "password") {
      if (value.length < 8) {
        errors[field] = "Password must be at least 8 characters";
        return;
      }
      if (!/[A-Z]/.test(value)) {
        errors[field] = "Password must include at least one uppercase letter";
        return;
      }
      if (!/[0-9]/.test(value)) {
        errors[field] = "Password must include at least one number";
        return;
      }
    }
  });

  return errors;
};
