/**
 * Authentication Service
 * Wraps Firebase Auth operations for admin login/logout.
 *
 * Equivalent to Flutter's AuthService using firebase_auth package.
 */

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  AuthError,
} from "firebase/auth";
import { auth } from "@/core/firebase";

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Sign in with email and password.
 * Validates credentials against Firebase Authentication.
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: credential.user };
  } catch (err) {
    const error = err as AuthError;
    const message = getAuthErrorMessage(error.code);
    return { success: false, error: message };
  }
}

/**
 * Sign out the current admin user.
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get the currently signed-in user.
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Maps Firebase error codes to user-friendly messages.
 */
function getAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    case "auth/invalid-credential":
      return "Invalid credentials. Please check your email and password.";
    default:
      return "Authentication failed. Please try again.";
  }
}
