"use server";

/**
 * Checks if the Google OAuth credentials are set in the server-side environment variables.
 */
export async function checkGoogleOAuth() {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_ID !== "" &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_SECRET !== ""
  );
}
