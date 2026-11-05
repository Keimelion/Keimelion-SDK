import { createAuthClient } from './auth.js'
import type { AuthClient } from './auth.js'
import { createHttpClient } from './http-client.js'
import type { HttpClient, HttpClientOptions } from './http-client.js'

export type CreateClientOptions = HttpClientOptions

export interface KeimelionClient {
  http: HttpClient
  auth: AuthClient
}

export function createClient(options: CreateClientOptions): KeimelionClient {
  const http = createHttpClient(options)
  return {
    http,
    auth: createAuthClient(http),
  }
}
