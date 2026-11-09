import { categoriesListResponseSchema } from '../../../src/schemas/categories/list-categories.js'
import { collaboratorsAcceptInviteResponseSchema } from '../../../src/schemas/collaborators/accept-invite.js'
import { collaboratorsCreateInviteResponseSchema } from '../../../src/schemas/collaborators/create-invite.js'
import { feedbackCreateResponseSchema } from '../../../src/schemas/feedback/create-feedback.js'
import { healthGetResponseSchema } from '../../../src/schemas/health/get-health.js'
import { itemsCreateResponseSchema } from '../../../src/schemas/items/create-item.js'
import { itemsGetResponseSchema } from '../../../src/schemas/items/get-item.js'
import { itemsListResponseSchema } from '../../../src/schemas/items/list-items.js'
import { itemsUpdateResponseSchema } from '../../../src/schemas/items/update-item.js'
import { listItemsCreateResponseSchema } from '../../../src/schemas/list-items/create-list-item.js'
import { listItemsUpdateResponseSchema } from '../../../src/schemas/list-items/update-list-item.js'
import { listsAddItemResponseSchema } from '../../../src/schemas/lists/add-item.js'
import { listsCreateResponseSchema } from '../../../src/schemas/lists/create-list.js'
import { listsGetResponseSchema } from '../../../src/schemas/lists/get-list.js'
import { listsListResponseSchema } from '../../../src/schemas/lists/list-lists.js'
import { listsUpdateResponseSchema } from '../../../src/schemas/lists/update-list.js'
import { occasionTypesListResponseSchema } from '../../../src/schemas/occasion-types/list-occasion-types.js'
import { waitlistCreateResponseSchema } from '../../../src/schemas/public/create-waitlist-entry.js'
import { publicListsGetResponseSchema } from '../../../src/schemas/public/get-public-list.js'
import { reservationsCreateResponseSchema } from '../../../src/schemas/reservations/create-reservation.js'
import { reportsCreateResponseSchema } from '../../../src/schemas/reports/create-report.js'
import { reservationsGetResponseSchema } from '../../../src/schemas/reservations/get-reservation.js'
import { tagsListResponseSchema } from '../../../src/schemas/tags/list-tags.js'
import { usersGetProfileResponseSchema } from '../../../src/schemas/users/get-profile.js'
import { usersListReservationsResponseSchema } from '../../../src/schemas/users/list-reservations.js'
import { usersUpdateProfileResponseSchema } from '../../../src/schemas/users/update-profile.js'
import { messageResponseSchema } from '../../../src/schemas/_shared/message-response.js'
import { noContentResponseSchema } from '../../../src/schemas/_shared/no-content.js'
import {
  buildCategorySummaryWire,
  buildCollaboratorDetailWire,
  buildFeedbackDetailWire,
  buildItemDetailWire,
  buildItemSourceDetailWire,
  buildItemWithSourcesWire,
  buildListDetailWire,
  buildListItemDetailWire,
  buildReportDetailWire,
  buildReservationDetailWire,
  buildTagSummaryWire,
  buildUserDetailWire,
  CREATED_AT_ISO,
  ID,
  PAGINATION_WIRE,
  UPDATED_AT_ISO,
} from '../../fixtures.js'
import { paginated } from './endpoint-case.js'
import type { EndpointCase } from './endpoint-case.js'

const MESSAGE_WIRE = { message: 'Done' }
const INVITE_TOKEN = 'a'.repeat(64)
const LIST_ITEM_INPUT = { listId: ID, itemId: ID, quantityDesired: 2, creatorNote: 'note' }
const RESERVATION_TOKEN = 'rsv_token'

const publicItem = {
  id: ID,
  name: 'Headphones',
  description: null,
  imageId: null,
  image: null,
  sources: [buildItemSourceDetailWire()],
  categories: [buildCategorySummaryWire()],
  tags: [buildTagSummaryWire()],
  createdAt: CREATED_AT_ISO,
  updatedAt: UPDATED_AT_ISO,
}

const publicList = {
  id: ID,
  title: 'Birthday',
  slug: 'birthday-abc',
  description: null,
  listStatus: 'active',
  occasionTypeId: null,
  owner: { id: ID, username: 'jane', avatar: null },
  tags: [buildTagSummaryWire()],
  items: [{ ...buildListItemDetailWire(), item: publicItem }],
  createdAt: CREATED_AT_ISO,
  updatedAt: UPDATED_AT_ISO,
}

export const USER_FACING_CASES: EndpointCase[] = [
  {
    id: 'GET /health',
    call: (client) => client.health.get(),
    wire: { status: 'ok', database: 'ok', timestamp: CREATED_AT_ISO, version: '1.2.3' },
    schema: healthGetResponseSchema,
    auth: 'none',
  },
  {
    id: 'GET /v1/lists',
    call: (client) => client.lists.list({ page: 2, sort: 'title:asc' }),
    wire: paginated(buildListDetailWire()),
    schema: listsListResponseSchema,
    query: { page: '2', sort: 'title:asc' },
  },
  {
    id: 'POST /v1/lists',
    call: (client) => client.lists.create({ title: 'Birthday', tags: ['fun'] }),
    wire: { list: buildListDetailWire() },
    schema: listsCreateResponseSchema,
    status: 201,
    body: { title: 'Birthday', tags: ['fun'] },
  },
  {
    id: 'GET /v1/lists/:id',
    call: (client) => client.lists.get(ID),
    wire: { list: buildListDetailWire() },
    schema: listsGetResponseSchema,
  },
  {
    id: 'PATCH /v1/lists/:id',
    call: (client) => client.lists.update(ID, { listStatus: 'archived' }),
    wire: { list: buildListDetailWire() },
    schema: listsUpdateResponseSchema,
    body: { listStatus: 'archived' },
  },
  {
    id: 'DELETE /v1/lists/:id',
    call: (client) => client.lists.delete(ID),
    wire: undefined,
    schema: noContentResponseSchema,
    status: 204,
  },
  {
    id: 'POST /v1/lists/:id/items',
    call: (client) => client.lists.addItem(ID, { itemId: ID }),
    wire: {
      listItem: { ...buildListItemDetailWire(), item: buildItemDetailWire(), source: null },
    },
    schema: listsAddItemResponseSchema,
    status: 201,
    body: { itemId: ID },
  },
  {
    id: 'POST /v1/lists/:id/collaborators/invites',
    call: (client) => client.collaborators.createInvite(ID, { email: 'bob@example.com' }),
    wire: { invite: buildCollaboratorDetailWire() },
    schema: collaboratorsCreateInviteResponseSchema,
    status: 201,
    body: { email: 'bob@example.com' },
  },
  {
    id: 'POST /v1/collaborators/invites/accept',
    call: (client) => client.collaborators.acceptInvite({ token: INVITE_TOKEN }),
    wire: { invite: buildCollaboratorDetailWire() },
    schema: collaboratorsAcceptInviteResponseSchema,
    body: { token: INVITE_TOKEN },
  },
  {
    id: 'POST /v1/list-items',
    call: (client) => client.listItems.create(LIST_ITEM_INPUT),
    wire: { listItem: buildListItemDetailWire() },
    schema: listItemsCreateResponseSchema,
    status: 201,
    body: LIST_ITEM_INPUT,
  },
  {
    id: 'PATCH /v1/list-items/:id',
    call: (client) => client.listItems.update(ID, { sortOrder: 3 }),
    wire: { listItem: buildListItemDetailWire() },
    schema: listItemsUpdateResponseSchema,
    body: { sortOrder: 3 },
  },
  {
    id: 'DELETE /v1/list-items/:id',
    call: (client) => client.listItems.delete(ID),
    wire: MESSAGE_WIRE,
    schema: messageResponseSchema,
  },
  {
    id: 'GET /v1/items',
    call: (client) => client.items.list({ limit: 5 }),
    wire: paginated(buildItemWithSourcesWire()),
    schema: itemsListResponseSchema,
    auth: 'none',
    query: { limit: '5' },
  },
  {
    id: 'POST /v1/items',
    call: (client) => client.items.create({ name: 'Headphones' }),
    wire: { item: buildItemWithSourcesWire() },
    schema: itemsCreateResponseSchema,
    status: 201,
    body: { name: 'Headphones' },
  },
  {
    id: 'GET /v1/items/:id',
    call: (client) => client.items.get(ID),
    wire: { item: buildItemWithSourcesWire() },
    schema: itemsGetResponseSchema,
    auth: 'none',
  },
  {
    id: 'PATCH /v1/items/:id',
    call: (client) => client.items.update(ID, { name: 'New' }),
    wire: { item: buildItemWithSourcesWire() },
    schema: itemsUpdateResponseSchema,
    body: { name: 'New' },
  },
  {
    id: 'GET /v1/categories',
    call: (client) => client.categories.list(),
    wire: {
      categories: [
        {
          ...buildCategorySummaryWire(),
          children: [{ ...buildCategorySummaryWire(), parentId: ID, depth: 1, children: [] }],
        },
      ],
    },
    schema: categoriesListResponseSchema,
    auth: 'none',
  },
  {
    id: 'GET /v1/occasion-types',
    call: (client) => client.occasionTypes.list(),
    wire: [{ id: ID, slug: 'birthday', label: 'Birthday', emoji: null }],
    schema: occasionTypesListResponseSchema,
    auth: 'none',
  },
  {
    id: 'GET /v1/tags',
    call: (client) => client.tags.list({ name: 'gam' }),
    wire: paginated(buildTagSummaryWire()),
    schema: tagsListResponseSchema,
    query: { name: 'gam' },
  },
  {
    id: 'GET /v1/users/me',
    call: (client) => client.users.getProfile(),
    wire: { user: buildUserDetailWire() },
    schema: usersGetProfileResponseSchema,
  },
  {
    id: 'PATCH /v1/users/me',
    call: (client) => client.users.updateProfile({ username: null }),
    wire: { user: buildUserDetailWire() },
    schema: usersUpdateProfileResponseSchema,
    body: { username: null },
  },
  {
    id: 'DELETE /v1/users/me',
    call: (client) => client.users.deleteAccount(),
    wire: MESSAGE_WIRE,
    schema: messageResponseSchema,
  },
  {
    id: 'POST /v1/users/me/change-password',
    call: (client) =>
      client.users.changePassword({ currentPassword: 'old-password', newPassword: 'new-password' }),
    wire: MESSAGE_WIRE,
    schema: messageResponseSchema,
    body: { currentPassword: 'old-password', newPassword: 'new-password' },
  },
  {
    id: 'GET /v1/users/me/reservations',
    call: (client) => client.users.listReservations({ sort: 'createdAt:desc' }),
    wire: {
      items: [
        {
          reservation: { id: ID, quantityBooked: 1, createdAt: CREATED_AT_ISO },
          listItem: { id: ID, name: 'Headphones', quantityDesired: 2, imageId: null, image: null },
          list: { id: ID, slug: 'birthday-abc', title: 'Birthday', ownerDisplayName: 'jane' },
        },
      ],
      pagination: PAGINATION_WIRE,
    },
    schema: usersListReservationsResponseSchema,
    query: { sort: 'createdAt:desc' },
  },
  {
    id: 'POST /v1/reservations',
    call: (client) => client.reservations.create({ listItemId: ID, quantityBooked: 1 }),
    wire: {
      reservation: {
        id: ID,
        listItemId: ID,
        userId: null,
        reserverName: 'Bob',
        reserverEmail: null,
        quantityBooked: 1,
        createdAt: CREATED_AT_ISO,
      },
      listItem: { id: ID, quantityReservedTotal: 1, itemStatus: 'reserved' },
      token: RESERVATION_TOKEN,
    },
    schema: reservationsCreateResponseSchema,
    status: 201,
    body: { listItemId: ID, quantityBooked: 1 },
  },
  {
    id: 'GET /v1/reservations/:id',
    call: (client) => client.reservations.get(ID, { reservationToken: RESERVATION_TOKEN }),
    wire: { reservation: buildReservationDetailWire() },
    schema: reservationsGetResponseSchema,
    auth: RESERVATION_TOKEN,
  },
  {
    id: 'DELETE /v1/reservations/:id',
    call: (client) => client.reservations.delete(ID),
    wire: undefined,
    schema: noContentResponseSchema,
    status: 204,
  },
  {
    id: 'POST /v1/feedback',
    call: (client) => client.feedback.create({ title: 'Bug', description: 'It broke' }),
    wire: { feedback: buildFeedbackDetailWire() },
    schema: feedbackCreateResponseSchema,
    status: 201,
    body: { title: 'Bug', description: 'It broke' },
  },
  {
    id: 'POST /v1/reports',
    call: (client) => client.reports.create({ targetType: 'list', targetId: ID, reason: 'spam' }),
    wire: { report: buildReportDetailWire() },
    schema: reportsCreateResponseSchema,
    status: 201,
    body: { targetType: 'list', targetId: ID, reason: 'spam' },
  },
  {
    id: 'GET /v1/public/lists/:slug',
    call: (client) => client.public.getList('birthday-abc'),
    wire: { list: publicList },
    schema: publicListsGetResponseSchema,
    auth: 'none',
    pathOverrides: { slug: 'birthday-abc' },
  },
  {
    id: 'POST /v1/public/waitlist',
    call: (client) =>
      client.public.createWaitlistEntry({
        email: 'visitor@example.com',
        locale: 'fr',
        consent: true,
      }),
    wire: { status: 'subscribed' },
    schema: waitlistCreateResponseSchema,
    status: 201,
    auth: 'none',
    body: { email: 'visitor@example.com', locale: 'fr', consent: true },
  },
]
