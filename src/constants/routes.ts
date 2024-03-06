/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const PUBLIC_ROUTES = ["/", "/auth/new-verification"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const AUTH_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/new-verification",
  "/error",
  "/reset",
  "/new-password",
];

/**
 * The default redirect path after logging in as USER role
 * @type {string}
 */
export const DEFAULT_USER_REDIRECT = "/";
