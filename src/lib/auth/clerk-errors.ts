import { isClerkAPIResponseError } from "@clerk/expo";

const FALLBACK = "Something went wrong. Please try again.";

// One friendly line from a Clerk error, for the auth screens' StatusBanner.
// ClerkError.message includes the code and docs link, so prefer longMessage.
export function authErrorMessage(e: unknown) {
  if (isClerkAPIResponseError(e)) {
    const first = e.errors[0];
    return first?.longMessage ?? first?.message ?? FALLBACK;
  }
  if (e && typeof e === "object" && "longMessage" in e && typeof e.longMessage === "string") {
    return e.longMessage;
  }
  return FALLBACK;
}
