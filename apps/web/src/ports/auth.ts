export interface AuthPort {
  signInWithEmail(email: string): Promise<void>
  signOut(): Promise<void>
  getSession(): Promise<{ userId?: string }>
}
