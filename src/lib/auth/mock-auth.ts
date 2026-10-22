// Stand-in for Clerk custom flows (prompts/04-auth-screens.md). Screens call
// only these functions, so swapping in Clerk changes this file and the call
// sites, nothing else. Fixed inputs fail on purpose so error states can be
// tested: email taken@example.com, code 000000, password wrongpass.

export type OAuthProvider = "google" | "apple";

export class AuthError extends Error {}

const DELAY_MS = 800;

const wait = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

export async function signUp(input: { name: string; email: string; password: string }) {
  await wait();
  if (input.email.toLowerCase() === "taken@example.com") {
    throw new AuthError("An account with this email already exists.");
  }
}

export async function verifyEmail(code: string) {
  await wait();
  if (code === "000000") throw new AuthError("That code isn't right. Check your email and try again.");
}

export async function resendCode() {
  await wait();
}

export async function signIn(input: { email: string; password: string }) {
  await wait();
  if (input.password === "wrongpass") throw new AuthError("Email or password is incorrect.");
}

export async function signInWithOAuth(_provider: OAuthProvider) {
  await wait();
}

export function authErrorMessage(e: unknown) {
  return e instanceof AuthError ? e.message : "Something went wrong. Please try again.";
}
