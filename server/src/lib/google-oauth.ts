import { OAuth2Client } from "google-auth-library";

/**
 * Creates and returns a Google OAuth2Client instance
 */
export function getGoogleOAuthClient(customRedirectUri?: string): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = customRedirectUri || process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/api/auth/google/callback";

  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured in environment variables");
  }

  return new OAuth2Client(clientId, clientSecret, redirectUri);
}

/**
 * Generates the Google OAuth consent authorization URL
 */
export function getGoogleAuthUrl(stateParam: string): string {
  const client = getGoogleOAuthClient();

  return client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    state: stateParam,
    prompt: "consent",
  });
}

/**
 * Exchanges authorization code for Google tokens and verifies the ID token.
 */
export async function verifyGoogleCode(code: string) {
  const client = getGoogleOAuthClient();

  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  if (!tokens.id_token) {
    throw new Error("Failed to receive Google ID token");
  }

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error("Invalid or incomplete Google user profile payload");
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split("@")[0],
    profileImageUrl: payload.picture,
  };
}