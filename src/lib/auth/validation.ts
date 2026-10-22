// Form checks for the auth screens. Each returns an error message or undefined.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD = 8;

export function validateName(name: string) {
  return name.trim() ? undefined : "Enter your full name";
}

export function validateEmail(email: string) {
  if (!email.trim()) return "Enter your email address";
  return EMAIL.test(email.trim()) ? undefined : "Enter a valid email address";
}

export function validatePassword(password: string) {
  if (!password) return "Enter a password";
  return password.length >= MIN_PASSWORD ? undefined : `Use at least ${MIN_PASSWORD} characters`;
}
