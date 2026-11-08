import { createAdminUsersClient } from './users/admin-users.client.js'
import type { AdminUsersClient } from './users/admin-users.client.js'
import { createAdminListsClient } from './lists/admin-lists.client.js'
import type { AdminListsClient } from './lists/admin-lists.client.js'
import { createAdminItemsClient } from './items/admin-items.client.js'
import type { AdminItemsClient } from './items/admin-items.client.js'
import { createAdminCategoriesClient } from './categories/admin-categories.client.js'
import type { AdminCategoriesClient } from './categories/admin-categories.client.js'
import { createAdminShopsClient } from './shops/admin-shops.client.js'
import type { AdminShopsClient } from './shops/admin-shops.client.js'
import { createAdminTagsClient } from './tags/admin-tags.client.js'
import type { AdminTagsClient } from './tags/admin-tags.client.js'
import { createAdminOccasionTypesClient } from './occasion-types/admin-occasion-types.client.js'
import type { AdminOccasionTypesClient } from './occasion-types/admin-occasion-types.client.js'
import { createAdminFeedbackClient } from './feedback/admin-feedback.client.js'
import type { AdminFeedbackClient } from './feedback/admin-feedback.client.js'
import { createAdminReservationsClient } from './reservations/admin-reservations.client.js'
import type { AdminReservationsClient } from './reservations/admin-reservations.client.js'
import { createAdminCollaboratorInvitesClient } from './collaborator-invites/admin-collaborator-invites.client.js'
import type { AdminCollaboratorInvitesClient } from './collaborator-invites/admin-collaborator-invites.client.js'
import { createAdminReportsClient } from './reports/admin-reports.client.js'
import type { AdminReportsClient } from './reports/admin-reports.client.js'
import type { HttpClient } from '../_core/http-client.js'

export interface AdminClient {
  users: AdminUsersClient
  lists: AdminListsClient
  items: AdminItemsClient
  categories: AdminCategoriesClient
  shops: AdminShopsClient
  tags: AdminTagsClient
  occasionTypes: AdminOccasionTypesClient
  feedback: AdminFeedbackClient
  reservations: AdminReservationsClient
  collaboratorInvites: AdminCollaboratorInvitesClient
  reports: AdminReportsClient
}

export function createAdminClient(http: HttpClient): AdminClient {
  return {
    users: createAdminUsersClient(http),
    lists: createAdminListsClient(http),
    items: createAdminItemsClient(http),
    categories: createAdminCategoriesClient(http),
    shops: createAdminShopsClient(http),
    tags: createAdminTagsClient(http),
    occasionTypes: createAdminOccasionTypesClient(http),
    feedback: createAdminFeedbackClient(http),
    reservations: createAdminReservationsClient(http),
    collaboratorInvites: createAdminCollaboratorInvitesClient(http),
    reports: createAdminReportsClient(http),
  }
}
