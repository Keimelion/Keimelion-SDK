import type { ImageDetailInput } from '../src/schemas/_shared/image-detail.js'
import type { CategorySummaryInput } from '../src/schemas/_shared/category-summary.js'
import type { FeedbackDetailInput } from '../src/schemas/_shared/feedback-detail.js'
import type {
  ItemDetailInput,
  ItemSourceDetailInput,
  ItemWithSourcesDetailInput,
} from '../src/schemas/_shared/item-detail.js'
import type { ListDetailInput } from '../src/schemas/_shared/list-detail.js'
import type { ListItemDetailInput } from '../src/schemas/_shared/list-item-detail.js'
import type {
  CollaboratorDetailInput,
  ListMemberSummaryInput,
} from '../src/schemas/_shared/list-member.js'
import type { ReservationDetailInput } from '../src/schemas/_shared/reservation-detail.js'
import type { ShopSummaryInput } from '../src/schemas/_shared/shop-summary.js'
import type { TagSummaryInput } from '../src/schemas/_shared/tag-summary.js'
import type { UserDetailInput } from '../src/schemas/_shared/user-detail.js'

export const CREATED_AT_ISO = '2026-11-05T10:15:30.000Z'
export const UPDATED_AT_ISO = '2026-11-05T11:00:00.000Z'
export const ID = '11111111-1111-4111-8111-111111111111'
export const SOURCE_ID = '22222222-2222-4222-8222-222222222222'
export const PAGINATION_WIRE = { page: 1, limit: 20, total: 1, totalPages: 1 }

const TIMESTAMPS = { createdAt: CREATED_AT_ISO, updatedAt: UPDATED_AT_ISO }

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

export function buildTagSummaryWire(): TagSummaryInput {
  return { id: ID, name: 'Gaming', slug: 'gaming' }
}

export function buildShopSummaryWire(): ShopSummaryInput {
  return {
    id: ID,
    slug: 'my-shop',
    name: 'My shop',
    domain: 'example.com',
    logoUrl: null,
    isAffiliated: false,
  }
}

export function buildCategorySummaryWire(): CategorySummaryInput {
  return { id: ID, parentId: null, name: 'Books', slug: 'books', depth: 0 }
}

export function buildItemDetailWire(): ItemDetailInput {
  return {
    id: ID,
    name: 'Headphones',
    description: null,
    imageId: null,
    image: null,
    createdByUserId: ID,
    ...TIMESTAMPS,
  }
}

export function buildItemSourceDetailWire(): ItemSourceDetailInput {
  return {
    id: SOURCE_ID,
    itemId: ID,
    shopId: ID,
    shop: buildShopSummaryWire(),
    sourceUrl: 'https://example.com/headphones',
    price: '19.99',
    currency: 'EUR',
    ...TIMESTAMPS,
  }
}

export function buildItemWithSourcesWire(): ItemWithSourcesDetailInput {
  return {
    ...buildItemDetailWire(),
    sources: [buildItemSourceDetailWire()],
    categories: [buildCategorySummaryWire()],
    tags: [buildTagSummaryWire()],
  }
}

export function buildListItemDetailWire(): ListItemDetailInput {
  return {
    id: ID,
    listId: ID,
    itemId: ID,
    quantityDesired: 2,
    quantityReservedTotal: 1,
    itemStatus: 'available',
    sortOrder: null,
    creatorNote: null,
    ...TIMESTAMPS,
  }
}

export function buildListMemberWire(): ListMemberSummaryInput {
  return { id: ID, email: 'jane@example.com', username: 'jane', avatar: null }
}

export function buildCollaboratorDetailWire(): CollaboratorDetailInput {
  return {
    id: ID,
    listId: ID,
    user: buildListMemberWire(),
    invitedEmail: 'bob@example.com',
    inviteStatus: 'pending',
    role: 'editor',
    acceptedAt: null,
    ...TIMESTAMPS,
  }
}

export function buildListDetailWire(): ListDetailInput {
  return {
    id: ID,
    title: 'Birthday',
    slug: 'birthday-abc',
    description: null,
    listStatus: 'active',
    occasionTypeId: null,
    owner: buildListMemberWire(),
    collaborators: [
      { user: buildListMemberWire(), invitedEmail: null, status: 'accepted', role: 'owner' },
    ],
    tags: [buildTagSummaryWire()],
    ...TIMESTAMPS,
  }
}

export function buildReservationDetailWire(): ReservationDetailInput {
  return {
    id: ID,
    reserverName: null,
    reserverEmail: null,
    quantityBooked: 1,
    createdAt: CREATED_AT_ISO,
    listItem: { id: ID, quantityDesired: 2, item: buildItemDetailWire() },
    list: { id: ID, slug: 'birthday-abc', title: 'Birthday', owner: buildUserDetailWire() },
  }
}

export function buildFeedbackDetailWire(): FeedbackDetailInput {
  return {
    id: ID,
    userId: null,
    title: 'Bug',
    description: 'It broke',
    context: { page: '/lists' },
    status: 'open',
    ...TIMESTAMPS,
  }
}
