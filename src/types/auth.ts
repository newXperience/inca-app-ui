export interface User {
  id: string
  fullName: string
  username: string
  email: string
  role: string
  token: string
  expiresIn: string
}

export interface AuthContextType {
  user: User | null
  // eslint-disable-next-line no-unused-vars
  signIn: (username: string, password: string) => Promise<User>
  signOut: () => void
  isLoading: boolean
  error: string | null
}

export interface SignInRequest {
  username: string
  password: string
}

export interface SignInResponse {
  data: User
  message?: string
  status: number
}

export interface ApiErrorResponse {
  message: string
  code?: string
  status?: number
  details?: string[]
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export type UserRole = 'admin' | 'user' | 'moderator'

export interface TokenData {
  token: string
  expiresAt: string
  refreshToken?: string
}

export interface SignInFormData {
  username: string
  password: string
}

export interface SignInFormErrors {
  username?: string
  password?: string
  general?: string
}
