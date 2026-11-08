import { createAdminClient } from './admin/admin.client.js'
import type { AdminClient } from './admin/admin.client.js'
import { createAuthClient } from './auth/auth.client.js'
import type { AuthClient } from './auth/auth.client.js'
import { createHealthClient } from './health/health.client.js'
import type { HealthClient } from './health/health.client.js'
import { createListsClient } from './lists/lists.client.js'
import type { ListsClient } from './lists/lists.client.js'
import { createCollaboratorsClient } from './collaborators/collaborators.client.js'
import type { CollaboratorsClient } from './collaborators/collaborators.client.js'
import { createListItemsClient } from './list-items/list-items.client.js'
import type { ListItemsClient } from './list-items/list-items.client.js'
import { createItemsClient } from './items/items.client.js'
import type { ItemsClient } from './items/items.client.js'
import { createCategoriesClient } from './categories/categories.client.js'
import type { CategoriesClient } from './categories/categories.client.js'
import { createOccasionTypesClient } from './occasion-types/occasion-types.client.js'
import type { OccasionTypesClient } from './occasion-types/occasion-types.client.js'
import { createTagsClient } from './tags/tags.client.js'
import type { TagsClient } from './tags/tags.client.js'
import { createUsersClient } from './users/users.client.js'
import type { UsersClient } from './users/users.client.js'
import { createReservationsClient } from './reservations/reservations.client.js'
import type { ReservationsClient } from './reservations/reservations.client.js'
import { createFeedbackClient } from './feedback/feedback.client.js'
import type { FeedbackClient } from './feedback/feedback.client.js'
import { createPublicClient } from './public/public.client.js'
import type { PublicClient } from './public/public.client.js'
import { createReportsClient } from './reports/reports.client.js'
import type { ReportsClient } from './reports/reports.client.js'
import { createHttpClient } from './_core/http-client.js'
import type { HttpClient, HttpClientOptions } from './_core/http-client.js'

export type CreateClientOptions = HttpClientOptions

// Full client with every domain. Consumers that only need a few domains (e.g. the extension)
// can compose `createHttpClient` + `createXClient(http)` instead, so bundlers drop the rest.
export interface KeimelionClient {
  http: HttpClient
  auth: AuthClient
  reports: ReportsClient
  health: HealthClient
  lists: ListsClient
  collaborators: CollaboratorsClient
  listItems: ListItemsClient
  items: ItemsClient
  categories: CategoriesClient
  occasionTypes: OccasionTypesClient
  tags: TagsClient
  users: UsersClient
  reservations: ReservationsClient
  feedback: FeedbackClient
  public: PublicClient
  admin: AdminClient
}

export function createClient(options: CreateClientOptions): KeimelionClient {
  const http = createHttpClient(options)
  return {
    http,
    auth: createAuthClient(http),
    reports: createReportsClient(http),
    health: createHealthClient(http),
    lists: createListsClient(http),
    collaborators: createCollaboratorsClient(http),
    listItems: createListItemsClient(http),
    items: createItemsClient(http),
    categories: createCategoriesClient(http),
    occasionTypes: createOccasionTypesClient(http),
    tags: createTagsClient(http),
    users: createUsersClient(http),
    reservations: createReservationsClient(http),
    feedback: createFeedbackClient(http),
    public: createPublicClient(http),
    admin: createAdminClient(http),
  }
}
