import { createAuthClient } from './auth/auth.client.js'
import type { AuthClient } from './auth/auth.client.js'
import { createHttpClient } from './_core/http-client.js'
import type { HttpClient, HttpClientOptions } from './_core/http-client.js'

export type CreateClientOptions = HttpClientOptions

// Full client with every domain. Consumers that only need a few domains (e.g. the extension)
// can compose `createHttpClient` + `createXClient(http)` instead, so bundlers drop the rest.
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
