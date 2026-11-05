import { HttpMethod } from '../enums/http.js'
import { loginResponseSchema } from '../schemas/auth/login.js'
import type { LoginRequestInput, LoginResponseParsed } from '../schemas/auth/login.js'
import { refreshResponseSchema } from '../schemas/auth/refresh.js'
import type { RefreshRequestInput, RefreshResponseParsed } from '../schemas/auth/refresh.js'
import { logoutResponseSchema } from '../schemas/auth/logout.js'
import type { LogoutRequestInput, LogoutResponseParsed } from '../schemas/auth/logout.js'
import { registerResponseSchema } from '../schemas/auth/register.js'
import type { RegisterRequestInput, RegisterResponseParsed } from '../schemas/auth/register.js'
import { verifyEmailResponseSchema } from '../schemas/auth/verify-email.js'
import type {
  VerifyEmailRequestInput,
  VerifyEmailResponseParsed,
} from '../schemas/auth/verify-email.js'
import { forgotPasswordResponseSchema } from '../schemas/auth/forgot-password.js'
import type {
  ForgotPasswordRequestInput,
  ForgotPasswordResponseParsed,
} from '../schemas/auth/forgot-password.js'
import { resetPasswordResponseSchema } from '../schemas/auth/reset-password.js'
import type {
  ResetPasswordRequestInput,
  ResetPasswordResponseParsed,
} from '../schemas/auth/reset-password.js'
import type { HttpClient } from './http-client.js'

export const AuthPaths = {
  REGISTER: '/v1/auth/register',
  VERIFY_EMAIL: '/v1/auth/verify-email',
  LOGIN: '/v1/auth/login',
  REFRESH: '/v1/auth/refresh',
  LOGOUT: '/v1/auth/logout',
  FORGOT_PASSWORD: '/v1/auth/forgot-password',
  RESET_PASSWORD: '/v1/auth/reset-password',
} as const

export interface AuthClient {
  register(input: RegisterRequestInput): Promise<RegisterResponseParsed>
  verifyEmail(input: VerifyEmailRequestInput): Promise<VerifyEmailResponseParsed>
  login(input: LoginRequestInput): Promise<LoginResponseParsed>
  refresh(input: RefreshRequestInput): Promise<RefreshResponseParsed>
  logout(input?: LogoutRequestInput): Promise<LogoutResponseParsed>
  forgotPassword(input: ForgotPasswordRequestInput): Promise<ForgotPasswordResponseParsed>
  resetPassword(input: ResetPasswordRequestInput): Promise<ResetPasswordResponseParsed>
}

export function createAuthClient(http: HttpClient): AuthClient {
  return {
    register: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: AuthPaths.REGISTER,
        body: input,
        responseSchema: registerResponseSchema,
      }),
    verifyEmail: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: AuthPaths.VERIFY_EMAIL,
        body: input,
        responseSchema: verifyEmailResponseSchema,
      }),
    login: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: AuthPaths.LOGIN,
        body: input,
        responseSchema: loginResponseSchema,
      }),
    refresh: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: AuthPaths.REFRESH,
        body: input,
        responseSchema: refreshResponseSchema,
      }),
    logout: (input = {}) =>
      http.request({
        method: HttpMethod.POST,
        path: AuthPaths.LOGOUT,
        body: input,
        responseSchema: logoutResponseSchema,
      }),
    forgotPassword: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: AuthPaths.FORGOT_PASSWORD,
        body: input,
        responseSchema: forgotPasswordResponseSchema,
      }),
    resetPassword: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: AuthPaths.RESET_PASSWORD,
        body: input,
        responseSchema: resetPasswordResponseSchema,
      }),
  }
}
