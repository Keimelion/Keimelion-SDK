import { adminCategoriesCreateResponseSchema } from '../../../src/schemas/admin/categories/create-category.js'
import {
  adminCategoriesGetResponseSchema,
  adminCategoriesListResponseSchema,
} from '../../../src/schemas/admin/categories/admin-category-detail.js'
import { adminCategoriesUpdateResponseSchema } from '../../../src/schemas/admin/categories/update-category.js'
import { adminCollaboratorInvitesListResponseSchema } from '../../../src/schemas/admin/collaborator-invites/admin-collaborator-invite-detail.js'
import {
  adminFeedbackListResponseSchema,
  adminFeedbackUpdateResponseSchema,
} from '../../../src/schemas/admin/feedback/admin-feedback-detail.js'
import {
  adminItemsGetResponseSchema,
  adminItemsListResponseSchema,
} from '../../../src/schemas/admin/items/admin-item-detail.js'
import { adminItemsCreateResponseSchema } from '../../../src/schemas/admin/items/create-item.js'
import {
  adminItemsCreateSourceResponseSchema,
  adminItemsUpdateSourceResponseSchema,
} from '../../../src/schemas/admin/items/item-sources.js'
import { adminItemsUpdateResponseSchema } from '../../../src/schemas/admin/items/update-item.js'
import {
  adminListsGetResponseSchema,
  adminListsListResponseSchema,
  adminListsRestoreResponseSchema,
} from '../../../src/schemas/admin/lists/admin-list-detail.js'
import { adminListsListItemsResponseSchema } from '../../../src/schemas/admin/lists/list-list-items.js'
import { adminListsUpdateResponseSchema } from '../../../src/schemas/admin/lists/update-list.js'
import { adminOccasionTypesListResponseSchema } from '../../../src/schemas/admin/occasion-types/admin-occasion-type-detail.js'
import { adminOccasionTypesCreateResponseSchema } from '../../../src/schemas/admin/occasion-types/create-occasion-type.js'
import { adminOccasionTypesUpdateResponseSchema } from '../../../src/schemas/admin/occasion-types/update-occasion-type.js'
import {
  adminReservationsGetResponseSchema,
  adminReservationsListResponseSchema,
} from '../../../src/schemas/admin/reservations/admin-reservation-detail.js'
import {
  adminShopsGetResponseSchema,
  adminShopsListResponseSchema,
} from '../../../src/schemas/admin/shops/admin-shop-detail.js'
import { adminShopsCreateResponseSchema } from '../../../src/schemas/admin/shops/create-shop.js'
import { adminShopsUpdateResponseSchema } from '../../../src/schemas/admin/shops/update-shop.js'
import {
  adminTagsGetResponseSchema,
  adminTagsListResponseSchema,
} from '../../../src/schemas/admin/tags/admin-tag-detail.js'
import { adminTagsCreateResponseSchema } from '../../../src/schemas/admin/tags/create-tag.js'
import { adminTagsUpdateResponseSchema } from '../../../src/schemas/admin/tags/update-tag.js'
import {
  adminUsersGetResponseSchema,
  adminUsersListResponseSchema,
} from '../../../src/schemas/admin/users/admin-user-detail.js'
import { adminUsersCreateResponseSchema } from '../../../src/schemas/admin/users/create-user.js'
import { adminUsersUpdateResponseSchema } from '../../../src/schemas/admin/users/update-user.js'
import { messageResponseSchema } from '../../../src/schemas/_shared/message-response.js'
import { noContentResponseSchema } from '../../../src/schemas/_shared/no-content.js'
import {
  buildCollaboratorDetailWire,
  buildFeedbackDetailWire,
  buildItemSourceDetailWire,
  buildItemWithSourcesWire,
  buildListDetailWire,
  buildListItemDetailWire,
  buildListMemberWire,
  buildReservationDetailWire,
  buildShopSummaryWire,
  buildTagSummaryWire,
  buildUserDetailWire,
  CREATED_AT_ISO,
  ID,
  SOURCE_ID,
  UPDATED_AT_ISO,
} from '../../fixtures.js'
import { paginated } from './endpoint-case.js'
import type { EndpointCase } from './endpoint-case.js'

const MESSAGE_WIRE = { message: 'Done' }
const TIMESTAMPS = { createdAt: CREATED_AT_ISO, updatedAt: UPDATED_AT_ISO }

function buildAdminUserWire(): object {
  return {
    ...buildUserDetailWire(),
    bannedAt: null,
    banReason: null,
    deletedAt: null,
    reservationsCount: 2,
  }
}

function buildAdminListWire(): object {
  return {
    ...buildListDetailWire(),
    collaborators: undefined,
    owner: buildUserDetailWire(),
    deletedAt: null,
    itemCount: 3,
    totalEstimatedPrice: '59.97',
    displayCurrency: 'EUR',
  }
}

function buildAdminItemWire(): object {
  return { ...buildItemWithSourcesWire(), reservationCount: 1 }
}

function buildShopDetailWire(): object {
  return { ...buildShopSummaryWire(), sortOrder: 0, isActive: true, ...TIMESTAMPS }
}

function buildTagDetailWire(): object {
  return { ...buildTagSummaryWire(), createdByUserId: null, ...TIMESTAMPS }
}

function buildAdminCategoryWire(): object {
  return {
    id: ID,
    parentId: null,
    slug: 'books',
    depth: 0,
    translations: { fr: 'Livres', en: 'Books' },
    ...TIMESTAMPS,
  }
}

function buildAdminOccasionTypeWire(): object {
  return {
    id: ID,
    slug: 'birthday',
    emoji: null,
    sortOrder: 0,
    isActive: true,
    translations: [{ locale: 'en', label: 'Birthday' }],
    ...TIMESTAMPS,
  }
}

const SOURCE_INPUT = { sourceUrl: 'https://example.com/p', price: '9.99' }

export const ADMIN_CASES: EndpointCase[] = [
  {
    id: 'GET /v1/admin/users',
    call: (client) =>
      client.admin.users.list({
        sort: 'email:asc',
        'email[ilike]': 'jane',
        'role[in][]': ['user'],
      }),
    wire: paginated(buildAdminUserWire()),
    schema: adminUsersListResponseSchema,
    query: { sort: 'email:asc', 'email[ilike]': 'jane', 'role[in][]': ['user'] },
  },
  {
    id: 'POST /v1/admin/users',
    call: (client) => client.admin.users.create({ email: 'a@example.com', role: 'user' }),
    wire: { user: buildAdminUserWire() },
    schema: adminUsersCreateResponseSchema,
    status: 201,
    body: { email: 'a@example.com', role: 'user' },
  },
  {
    id: 'GET /v1/admin/users/:id',
    call: (client) => client.admin.users.get(ID),
    wire: { user: buildAdminUserWire() },
    schema: adminUsersGetResponseSchema,
  },
  {
    id: 'PATCH /v1/admin/users/:id',
    call: (client) => client.admin.users.update(ID, { role: 'moderator' }),
    wire: { user: buildAdminUserWire() },
    schema: adminUsersUpdateResponseSchema,
    body: { role: 'moderator' },
  },
  {
    id: 'DELETE /v1/admin/users/:id',
    call: (client) => client.admin.users.delete(ID),
    wire: MESSAGE_WIRE,
    schema: messageResponseSchema,
  },
  {
    id: 'GET /v1/admin/lists',
    call: (client) =>
      client.admin.lists.list({
        currency: 'USD',
        ownerUserId: ID,
        'createdAt[between][]': ['2026-01-01T00:00:00Z', '2026-02-01T00:00:00Z'],
      }),
    wire: paginated(buildAdminListWire()),
    schema: adminListsListResponseSchema,
    query: {
      currency: 'USD',
      ownerUserId: ID,
      'createdAt[between][]': ['2026-01-01T00:00:00Z', '2026-02-01T00:00:00Z'],
    },
  },
  {
    id: 'GET /v1/admin/lists/:id',
    call: (client) => client.admin.lists.get(ID, { currency: 'GBP' }),
    wire: { list: buildAdminListWire() },
    schema: adminListsGetResponseSchema,
    query: { currency: 'GBP' },
  },
  {
    id: 'PATCH /v1/admin/lists/:id',
    call: (client) => client.admin.lists.update(ID, { listStatus: 'deleted' }),
    wire: { list: buildAdminListWire() },
    schema: adminListsUpdateResponseSchema,
    body: { listStatus: 'deleted' },
  },
  {
    id: 'DELETE /v1/admin/lists/:id',
    call: (client) => client.admin.lists.delete(ID),
    wire: undefined,
    schema: noContentResponseSchema,
    status: 204,
  },
  {
    id: 'POST /v1/admin/lists/:id/restore',
    call: (client) => client.admin.lists.restore(ID),
    wire: { list: buildAdminListWire() },
    schema: adminListsRestoreResponseSchema,
  },
  {
    id: 'GET /v1/admin/lists/:id/items',
    call: (client) => client.admin.lists.listItems(ID, { limit: 5 }),
    wire: paginated({
      ...buildListItemDetailWire(),
      item: buildItemWithSourcesWire(),
      sources: [buildItemSourceDetailWire()],
      averagePrice: '19.99',
      displayCurrency: 'EUR',
    }),
    schema: adminListsListItemsResponseSchema,
    query: { limit: '5' },
  },
  {
    id: 'GET /v1/admin/items',
    call: (client) => client.admin.items.list({ 'name[ilike]': 'head', sort: 'name:desc' }),
    wire: paginated(buildAdminItemWire()),
    schema: adminItemsListResponseSchema,
    query: { 'name[ilike]': 'head', sort: 'name:desc' },
  },
  {
    id: 'POST /v1/admin/items',
    call: (client) => client.admin.items.create({ name: 'Item', sources: [SOURCE_INPUT] }),
    wire: { item: buildItemWithSourcesWire() },
    schema: adminItemsCreateResponseSchema,
    status: 201,
    body: { name: 'Item', sources: [SOURCE_INPUT] },
  },
  {
    id: 'GET /v1/admin/items/:id',
    call: (client) => client.admin.items.get(ID),
    wire: { item: buildAdminItemWire() },
    schema: adminItemsGetResponseSchema,
  },
  {
    id: 'PATCH /v1/admin/items/:id',
    call: (client) => client.admin.items.update(ID, { clearImage: true }),
    wire: { item: buildItemWithSourcesWire() },
    schema: adminItemsUpdateResponseSchema,
    body: { clearImage: true },
  },
  {
    id: 'DELETE /v1/admin/items/:id',
    call: (client) => client.admin.items.delete(ID),
    wire: MESSAGE_WIRE,
    schema: messageResponseSchema,
  },
  {
    id: 'POST /v1/admin/items/:id/sources',
    call: (client) => client.admin.items.createSource(ID, SOURCE_INPUT),
    wire: { source: buildItemSourceDetailWire() },
    schema: adminItemsCreateSourceResponseSchema,
    status: 201,
    body: SOURCE_INPUT,
  },
  {
    id: 'PATCH /v1/admin/items/:id/sources/:sourceId',
    call: (client) => client.admin.items.updateSource(ID, SOURCE_ID, { price: null }),
    wire: { source: buildItemSourceDetailWire() },
    schema: adminItemsUpdateSourceResponseSchema,
    body: { price: null },
  },
  {
    id: 'DELETE /v1/admin/items/:id/sources/:sourceId',
    call: (client) => client.admin.items.deleteSource(ID, SOURCE_ID),
    wire: MESSAGE_WIRE,
    schema: messageResponseSchema,
  },
  {
    id: 'GET /v1/admin/categories',
    call: (client) => client.admin.categories.list(),
    wire: { items: [buildAdminCategoryWire()] },
    schema: adminCategoriesListResponseSchema,
  },
  {
    id: 'POST /v1/admin/categories',
    call: (client) =>
      client.admin.categories.create({ name: { fr: 'Livres', en: 'Books' }, slug: 'books' }),
    wire: { category: buildAdminCategoryWire() },
    schema: adminCategoriesCreateResponseSchema,
    status: 201,
    body: { name: { fr: 'Livres', en: 'Books' }, slug: 'books' },
  },
  {
    id: 'GET /v1/admin/categories/:id',
    call: (client) => client.admin.categories.get(ID),
    wire: { category: buildAdminCategoryWire() },
    schema: adminCategoriesGetResponseSchema,
  },
  {
    id: 'PATCH /v1/admin/categories/:id',
    call: (client) => client.admin.categories.update(ID, { parentId: null }),
    wire: { category: buildAdminCategoryWire() },
    schema: adminCategoriesUpdateResponseSchema,
    body: { parentId: null },
  },
  {
    id: 'DELETE /v1/admin/categories/:id',
    call: (client) => client.admin.categories.delete(ID),
    wire: undefined,
    schema: noContentResponseSchema,
    status: 204,
  },
  {
    id: 'GET /v1/admin/shops',
    call: (client) => client.admin.shops.list({ 'isActive[eq]': true }),
    wire: paginated(buildShopDetailWire()),
    schema: adminShopsListResponseSchema,
    query: { 'isActive[eq]': 'true' },
  },
  {
    id: 'POST /v1/admin/shops',
    call: (client) => client.admin.shops.create({ slug: 'my-shop', name: 'My shop' }),
    wire: { shop: buildShopDetailWire() },
    schema: adminShopsCreateResponseSchema,
    status: 201,
    body: { slug: 'my-shop', name: 'My shop' },
  },
  {
    id: 'GET /v1/admin/shops/:id',
    call: (client) => client.admin.shops.get(ID, { page: 2 }),
    wire: {
      shop: buildShopDetailWire(),
      items: [
        {
          id: SOURCE_ID,
          itemId: ID,
          itemName: 'Headphones',
          sourceUrl: null,
          price: '19.99',
          currency: 'EUR',
          createdAt: CREATED_AT_ISO,
        },
      ],
      itemsCount: 1,
    },
    schema: adminShopsGetResponseSchema,
    query: { page: '2' },
  },
  {
    id: 'PATCH /v1/admin/shops/:id',
    call: (client) => client.admin.shops.update(ID, { isActive: false }),
    wire: { shop: buildShopDetailWire() },
    schema: adminShopsUpdateResponseSchema,
    body: { isActive: false },
  },
  {
    id: 'DELETE /v1/admin/shops/:id',
    call: (client) => client.admin.shops.delete(ID),
    wire: undefined,
    schema: noContentResponseSchema,
    status: 204,
  },
  {
    id: 'GET /v1/admin/tags',
    call: (client) => client.admin.tags.list({ 'createdByUserId[isNull]': 'true' }),
    wire: paginated(buildTagDetailWire()),
    schema: adminTagsListResponseSchema,
    query: { 'createdByUserId[isNull]': 'true' },
  },
  {
    id: 'POST /v1/admin/tags',
    call: (client) => client.admin.tags.create({ name: 'Gaming', slug: 'gaming' }),
    wire: { tag: buildTagDetailWire() },
    schema: adminTagsCreateResponseSchema,
    status: 201,
    body: { name: 'Gaming', slug: 'gaming' },
  },
  {
    id: 'GET /v1/admin/tags/:id',
    call: (client) => client.admin.tags.get(ID),
    wire: { tag: buildTagDetailWire() },
    schema: adminTagsGetResponseSchema,
  },
  {
    id: 'PATCH /v1/admin/tags/:id',
    call: (client) => client.admin.tags.update(ID, { name: 'New' }),
    wire: { tag: buildTagDetailWire() },
    schema: adminTagsUpdateResponseSchema,
    body: { name: 'New' },
  },
  {
    id: 'DELETE /v1/admin/tags/:id',
    call: (client) => client.admin.tags.delete(ID),
    wire: undefined,
    schema: noContentResponseSchema,
    status: 204,
  },
  {
    id: 'GET /v1/admin/occasion-types',
    call: (client) => client.admin.occasionTypes.list({ limit: 10 }),
    wire: paginated(buildAdminOccasionTypeWire()),
    schema: adminOccasionTypesListResponseSchema,
    query: { limit: '10' },
  },
  {
    id: 'POST /v1/admin/occasion-types',
    call: (client) =>
      client.admin.occasionTypes.create({
        slug: 'birthday',
        translations: [{ locale: 'en', label: 'Birthday' }],
      }),
    wire: { occasionType: buildAdminOccasionTypeWire() },
    schema: adminOccasionTypesCreateResponseSchema,
    status: 201,
    body: { slug: 'birthday', translations: [{ locale: 'en', label: 'Birthday' }] },
  },
  {
    id: 'PATCH /v1/admin/occasion-types/:id',
    call: (client) => client.admin.occasionTypes.update(ID, { isActive: false }),
    wire: { occasionType: buildAdminOccasionTypeWire() },
    schema: adminOccasionTypesUpdateResponseSchema,
    body: { isActive: false },
  },
  {
    id: 'DELETE /v1/admin/occasion-types/:id',
    call: (client) => client.admin.occasionTypes.delete(ID),
    wire: undefined,
    schema: noContentResponseSchema,
    status: 204,
  },
  {
    id: 'GET /v1/admin/feedback',
    call: (client) => client.admin.feedback.list({ 'status[in][]': ['open', 'closed'] }),
    wire: paginated({
      ...buildFeedbackDetailWire(),
      user: { id: ID, username: 'jane', email: 'jane@example.com' },
    }),
    schema: adminFeedbackListResponseSchema,
    query: { 'status[in][]': ['open', 'closed'] },
  },
  {
    id: 'PATCH /v1/admin/feedback/:id',
    call: (client) => client.admin.feedback.update(ID, { status: 'closed' }),
    wire: { feedback: { ...buildFeedbackDetailWire(), user: null } },
    schema: adminFeedbackUpdateResponseSchema,
    body: { status: 'closed' },
  },
  {
    id: 'GET /v1/admin/reservations',
    call: (client) => client.admin.reservations.list({ listId: ID }),
    wire: paginated({ ...buildReservationDetailWire(), user: buildUserDetailWire() }),
    schema: adminReservationsListResponseSchema,
    query: { listId: ID },
  },
  {
    id: 'GET /v1/admin/reservations/:id',
    call: (client) => client.admin.reservations.get(ID),
    wire: { reservation: { ...buildReservationDetailWire(), user: null } },
    schema: adminReservationsGetResponseSchema,
  },
  {
    id: 'DELETE /v1/admin/reservations/:id',
    call: (client) => client.admin.reservations.delete(ID),
    wire: undefined,
    schema: noContentResponseSchema,
    status: 204,
  },
  {
    id: 'GET /v1/admin/collaborator-invites',
    call: (client) => client.admin.collaboratorInvites.list({ inviteStatus: 'pending' }),
    wire: paginated({
      ...buildCollaboratorDetailWire(),
      list: { id: ID, title: 'Birthday', slug: 'birthday-abc' },
      invitedBy: buildListMemberWire(),
      isExpired: false,
    }),
    schema: adminCollaboratorInvitesListResponseSchema,
    query: { inviteStatus: 'pending' },
  },
]
