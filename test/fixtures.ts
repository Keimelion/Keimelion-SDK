import type { ImageDetailInput } from '../src/schemas/_shared/image-detail.js'
import type { UserDetailInput } from '../src/schemas/users/user-detail.js'

export const CREATED_AT_ISO = '2026-11-05T10:15:30.000Z'
export const UPDATED_AT_ISO = '2026-11-05T11:00:00.000Z'

export function buildImageDetailWire(): ImageDetailInput {
  return {
    id: '7d1d7a52-0c1b-4b8e-9a43-3b1f0c3c9d10',
    hash: 'a3f1c2',
    mime: 'image/webp',
    sizeBytes: 1024,
    width: 300,
    height: 200,
    createdAt: CREATED_AT_ISO,
    urls: {
      sm: 'https://cdn.example.com/abc-300.webp',
      md: 'https://cdn.example.com/abc-800.webp',
      lg: 'https://cdn.example.com/abc-1600.webp',
    },
  }
}

export function buildUserDetailWire(): UserDetailInput {
  return {
    id: '2b0f4f0e-4a59-4a8e-8a51-0f0d6f7b3a11',
    email: 'jane@example.com',
    username: 'jane',
    authProvider: 'email',
    role: 'user',
    avatarImageId: null,
    avatar: null,
    isCgvAccepted: true,
    cgvAcceptedAt: CREATED_AT_ISO,
    isMarketingOptedIn: false,
    defaultCurrency: 'EUR',
    emailVerifiedAt: CREATED_AT_ISO,
    lastActiveAt: null,
    createdAt: CREATED_AT_ISO,
    updatedAt: UPDATED_AT_ISO,
  }
}
