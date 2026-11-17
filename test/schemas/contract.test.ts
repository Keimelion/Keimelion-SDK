import { describe, expect, expectTypeOf, it } from 'vitest'
import type { z } from 'zod'
import { ITEM_STATUS_VALUES } from '../../src/enums/item-status.js'
import { LIST_STATUS_VALUES } from '../../src/enums/list-status.js'
import * as schemas from '../../src/schemas/index.js'
import {
  CREATED_AT_ISO,
  ID,
  PAGINATION_WIRE,
  SOURCE_ID,
  buildItemSourceDetailWire,
  buildListDetailWire,
  buildUserDetailWire,
} from '../fixtures.js'

const OTHER_ID = '33333333-3333-4333-8333-333333333333'

const FILTERS_BY_ENDPOINT: Record<string, schemas.AdminFilterConfig> = {
  'GET /v1/admin/users': schemas.ADMIN_USERS_FILTERS,
  'GET /v1/admin/lists': schemas.ADMIN_LISTS_FILTERS,
  'GET /v1/admin/items': schemas.ADMIN_ITEMS_FILTERS,
  'GET /v1/admin/shops': schemas.ADMIN_SHOPS_FILTERS,
  'GET /v1/admin/tags': schemas.ADMIN_TAGS_FILTERS,
  'GET /v1/admin/feedback': schemas.ADMIN_FEEDBACK_FILTERS,
  'GET /v1/admin/reports': schemas.ADMIN_REPORTS_FILTERS,
}

describe('response conventions', () => {
  it('decodes *_at timestamps into Dates and keeps nullable ones null', () => {
    const parsed = schemas.adminUserDetailSchema.parse({
      ...buildUserDetailWire(),
      bannedAt: CREATED_AT_ISO,
      banReason: 'spam',
      deletedAt: null,
      activatedAt: CREATED_AT_ISO,
      status: 'banned',
      reservationsCount: 0,
    })

    expect(parsed.bannedAt).toBeInstanceOf(Date)
    expect(parsed.activatedAt).toBeInstanceOf(Date)
    expect(parsed.deletedAt).toBeNull()
  })

  it('rejects a non-ISO timestamp', () => {
    expect(
      schemas.feedbackDetailSchema.safeParse({
        id: ID,
        userId: null,
        title: 'a',
        description: 'b',
        context: null,
        status: 'open',
        createdAt: 'yesterday',
        updatedAt: CREATED_AT_ISO,
      }).success,
    ).toBe(false)
  })

  it('keeps Postgres numerics as strings', () => {
    const source = schemas.itemSourceDetailSchema.parse(buildItemSourceDetailWire())
    expect(source.price).toBe('19.99')
    expect(
      schemas.itemSourceDetailSchema.safeParse({ ...buildItemSourceDetailWire(), price: 19.99 })
        .success,
    ).toBe(false)
  })

  it('types numerics as strings and timestamps as Dates', () => {
    expectTypeOf<schemas.ItemSourceDetailParsed['price']>().toEqualTypeOf<string | null>()
    expectTypeOf<schemas.AdminListDetailParsed['totalEstimatedPrice']>().toEqualTypeOf<
      string | null
    >()
    expectTypeOf<schemas.ListDetailParsed['createdAt']>().toEqualTypeOf<Date>()
    expectTypeOf<schemas.ListDetailInput['createdAt']>().toEqualTypeOf<string>()
  })

  it('strips unknown keys on nested objects', () => {
    const wire = buildListDetailWire()
    const parsed = schemas.listDetailSchema.parse({
      ...wire,
      tags: [{ id: ID, name: 'a', slug: 'a', internal: true }],
    })

    expect(parsed.tags[0]).toEqual({ id: ID, name: 'a', slug: 'a' })
  })

  it('parses a recursive category tree', () => {
    const node = { id: ID, parentId: null, name: 'a', slug: 'a', depth: 0 }
    const parsed = schemas.categoriesListResponseSchema.parse({
      categories: [
        {
          ...node,
          children: [
            {
              ...node,
              depth: 1,
              children: [{ ...node, depth: 2, children: [] }],
            },
          ],
        },
      ],
    })

    expect(parsed.categories[0]?.children[0]?.children[0]?.depth).toBe(2)
  })

  it('returns the anonymous reservation token only when present', () => {
    const base = {
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
    }

    expect(schemas.reservationsCreateResponseSchema.parse(base).token).toBeUndefined()
    expect(schemas.reservationsCreateResponseSchema.parse({ ...base, token: 'rsv_x' }).token).toBe(
      'rsv_x',
    )
  })

  it('never declares a hash or an internal token on user and invite shapes', () => {
    const declared = [
      ...Object.keys(schemas.adminUserDetailSchema.shape),
      ...Object.keys(schemas.collaboratorDetailSchema.shape),
    ]

    expect(declared.filter((key) => /hash|token/i.test(key))).toEqual([])
  })

  it('parses a paginated response', () => {
    const parsed = schemas.tagsListResponseSchema.parse({
      items: [{ id: ID, name: 'a', slug: 'a' }],
      pagination: PAGINATION_WIRE,
    })

    expect(parsed.pagination.totalPages).toBe(1)
  })
})

describe('query schemas', () => {
  it('coerces pagination and applies its defaults', () => {
    expect(schemas.listsListQuerySchema.parse({ page: '3' })).toEqual({ page: 3, limit: 20 })
  })

  it('rejects a limit above the maximum', () => {
    expect(schemas.paginationQuerySchema.safeParse({ limit: 101 }).success).toBe(false)
  })

  it('accepts a declared sort field and rejects an unknown one', () => {
    expect(schemas.adminUsersListQuerySchema.parse({ sort: 'email:desc' }).sort).toEqual({
      field: 'email',
      direction: 'desc',
    })
    expect(schemas.adminUsersListQuerySchema.safeParse({ sort: 'passwordHash:asc' }).success).toBe(
      false,
    )
  })

  it('types the admin bracket filters from the declared operators', () => {
    expectTypeOf<{ 'email[ilike]': string }>().toExtend<schemas.AdminUsersListFilters>()
    expectTypeOf<{ 'role[in][]': string[] }>().toExtend<schemas.AdminUsersListFilters>()
    expectTypeOf<{ 'status[in][]': string[] }>().toExtend<schemas.AdminUsersListFilters>()
    expectTypeOf<schemas.AdminUsersListFilters>().not.toHaveProperty('email[between][]')
    expectTypeOf<schemas.AdminUsersListFilters>().not.toHaveProperty('role[in]')
  })

  it('types the admin reports filters from the declared operators', () => {
    expectTypeOf<{ 'targetType[in][]': string[] }>().toExtend<schemas.AdminReportsListFilters>()
    expectTypeOf<{ 'targetId[eq]': string }>().toExtend<schemas.AdminReportsListFilters>()
    expectTypeOf<schemas.AdminReportsListFilters>().not.toHaveProperty('targetId[in][]')
    expectTypeOf<schemas.AdminReportsListFilters>().not.toHaveProperty('reason[ilike]')
  })

  it('defaults the export format to json and rejects an unknown one', () => {
    expect(schemas.usersExportQuerySchema.parse({}).format).toBe('json')
    expect(schemas.usersExportQuerySchema.safeParse({ format: 'xml' }).success).toBe(false)
  })
})

// Mirrors the `sortable` / `filterable` of each API entity: a change on either side must be
// deliberate. Filters are `null` on routes that never call `validateFilters`.
describe.each<[string, z.ZodType, readonly string[], Record<string, readonly string[]> | null]>([
  [
    'GET /v1/lists',
    schemas.listsListQuerySchema,
    ['createdAt', 'updatedAt', 'title', 'listStatus', 'eventDate'],
    null,
  ],
  [
    'GET /v1/users/me/reservations',
    schemas.usersListReservationsQuerySchema,
    ['createdAt', 'quantityBooked'],
    null,
  ],
  [
    'GET /v1/admin/reservations',
    schemas.adminReservationsListQuerySchema,
    ['createdAt', 'quantityBooked'],
    null,
  ],
  [
    'GET /v1/admin/users',
    schemas.adminUsersListQuerySchema,
    ['createdAt', 'email', 'username', 'lastActiveAt'],
    {
      id: ['eq', 'in'],
      email: ['eq', 'ilike'],
      username: ['eq', 'ilike'],
      createdAt: ['gte', 'lte', 'between'],
      bannedAt: ['isNull'],
      deletedAt: ['isNull'],
      role: ['eq', 'in'],
      status: ['eq', 'in'],
    },
  ],
  [
    'GET /v1/admin/lists',
    schemas.adminListsListQuerySchema,
    ['createdAt', 'updatedAt', 'title', 'listStatus', 'eventDate'],
    {
      id: ['eq', 'in'],
      title: ['eq', 'ilike'],
      listStatus: ['eq', 'in'],
      occasionTypeId: ['eq', 'isNull'],
      createdAt: ['gte', 'lte', 'between'],
      updatedAt: ['gte', 'lte', 'between'],
      deletedAt: ['isNull'],
    },
  ],
  [
    'GET /v1/admin/items',
    schemas.adminItemsListQuerySchema,
    ['name', 'createdAt', 'updatedAt'],
    {
      id: ['eq', 'in'],
      name: ['eq', 'ilike'],
      createdByUserId: ['eq', 'isNull'],
      createdAt: ['gte', 'lte', 'between'],
    },
  ],
  [
    'GET /v1/admin/shops',
    schemas.adminShopsListQuerySchema,
    ['name', 'slug', 'sortOrder', 'createdAt', 'updatedAt'],
    {
      name: ['eq', 'ilike'],
      slug: ['eq', 'ilike'],
      domain: ['eq', 'ilike', 'isNull'],
      isAffiliated: ['eq'],
    },
  ],
  [
    'GET /v1/admin/tags',
    schemas.adminTagsListQuerySchema,
    ['name', 'slug', 'createdAt', 'updatedAt'],
    {
      name: ['eq', 'ilike'],
      slug: ['eq', 'ilike'],
      createdByUserId: ['eq', 'isNull'],
    },
  ],
  [
    'GET /v1/admin/feedback',
    schemas.adminFeedbackListQuerySchema,
    ['createdAt', 'updatedAt', 'status'],
    {
      status: ['eq', 'in'],
      userId: ['eq', 'isNull'],
      title: ['ilike'],
      createdAt: ['gte', 'lte', 'between'],
    },
  ],
  [
    'GET /v1/admin/reports',
    schemas.adminReportsListQuerySchema,
    ['createdAt', 'updatedAt', 'status'],
    {
      status: ['eq', 'in'],
      targetType: ['eq', 'in'],
      targetId: ['eq'],
      reason: ['eq', 'in'],
      userId: ['eq', 'isNull'],
      createdAt: ['gte', 'lte', 'between'],
    },
  ],
])('%s sort and filters', (id, querySchema, sortFields, filters) => {
  it.each(sortFields)('accepts sort on %s', (field) => {
    expect(querySchema.safeParse({ sort: `${field}:desc` }).success).toBe(true)
  })

  it('rejects a sort field the API does not declare', () => {
    expect(querySchema.safeParse({ sort: 'notSortable:asc' }).success).toBe(false)
  })

  it('exposes exactly the operators the API declares', () => {
    expect(FILTERS_BY_ENDPOINT[id] ?? null).toEqual(filters)
  })
})

describe('list requests', () => {
  it('requires a title, turns an empty description into null and rejects unknown keys', () => {
    expect(schemas.listsCreateRequestSchema.safeParse({}).success).toBe(false)
    expect(schemas.listsCreateRequestSchema.parse({ title: ' Trip ', description: ' ' })).toEqual({
      title: 'Trip',
      description: null,
    })
    expect(schemas.listsCreateRequestSchema.safeParse({ title: 'a', extra: 1 }).success).toBe(false)
  })

  it('never lets an owner change the list status, while an admin can still delete', () => {
    expect(schemas.listsUpdateRequestSchema.safeParse({ listStatus: 'active' }).success).toBe(false)
    expect(schemas.adminListsUpdateRequestSchema.safeParse({ listStatus: 'deleted' }).success).toBe(
      true,
    )
  })

  it('drops the archived list status and the purchased item status', () => {
    expect(
      schemas.adminListsUpdateRequestSchema.safeParse({ listStatus: 'archived' }).success,
    ).toBe(false)
    expect(LIST_STATUS_VALUES).toEqual(['active', 'deleted'])
    expect(ITEM_STATUS_VALUES).toEqual(['available', 'reserved'])
  })

  it('accepts a date-only eventDate within bounds, past dates included, and null', () => {
    expect(schemas.listsCreateRequestSchema.parse({ title: 'a', eventDate: '2026-12-25' })).toEqual(
      { title: 'a', eventDate: '2026-12-25' },
    )
    expect(
      schemas.listsUpdateRequestSchema.parse({ eventDate: schemas.MIN_LIST_EVENT_DATE }).eventDate,
    ).toBe(schemas.MIN_LIST_EVENT_DATE)
    expect(
      schemas.adminListsUpdateRequestSchema.parse({ eventDate: schemas.MAX_LIST_EVENT_DATE })
        .eventDate,
    ).toBe(schemas.MAX_LIST_EVENT_DATE)
    expect(schemas.listsUpdateRequestSchema.parse({ eventDate: null }).eventDate).toBeNull()
    expect(schemas.listsUpdateRequestSchema.parse({})).not.toHaveProperty('eventDate')
  })

  it.each([
    'abc',
    '2026-13-40',
    '2026-02-30',
    '2026-12-25T00:00:00Z',
    '1999-12-31',
    '2101-01-01',
    20261225,
  ])('rejects the eventDate %s on create, update and admin update', (eventDate) => {
    expect(schemas.listsCreateRequestSchema.safeParse({ title: 'a', eventDate }).success).toBe(
      false,
    )
    expect(schemas.listsUpdateRequestSchema.safeParse({ eventDate }).success).toBe(false)
    expect(schemas.adminListsUpdateRequestSchema.safeParse({ eventDate }).success).toBe(false)
  })

  it('names the violated bound in the eventDate error message', () => {
    const result = schemas.listEventDateSchema.safeParse('1999-12-31')

    expect(result.error?.issues[0]?.message).toContain(schemas.MIN_LIST_EVENT_DATE)
  })

  it('reports only the format issue for a malformed eventDate, not a misleading bound', () => {
    const result = schemas.listEventDateSchema.safeParse('abc')

    expect(result.error?.issues.map((issue) => issue.code)).toEqual(['invalid_format'])
  })

  it('returns eventDate as a plain date string on list responses', () => {
    const parsed = schemas.listDetailSchema.parse({
      ...buildListDetailWire(),
      eventDate: '2026-12-25',
    })

    expect(parsed.eventDate).toBe('2026-12-25')
    expectTypeOf<schemas.ListDetailParsed['eventDate']>().toEqualTypeOf<string | null>()
    expect(
      schemas.listDetailSchema.safeParse({ ...buildListDetailWire(), eventDate: undefined })
        .success,
    ).toBe(false)
  })

  it('rejects more tags than allowed', () => {
    const tags = Array.from(
      { length: schemas.MAX_TAGS_PER_RESOURCE + 1 },
      (_, index) => `t${String(index)}`,
    )

    expect(schemas.listsCreateRequestSchema.safeParse({ title: 'a', tags }).success).toBe(false)
  })

  it('bounds the desired quantity', () => {
    const body = { itemId: ID, quantityDesired: schemas.MAX_QUANTITY_DESIRED + 1 }

    expect(schemas.listsAddItemRequestSchema.safeParse(body).success).toBe(false)
  })
})

describe('collaborator requests', () => {
  it('lowercases the invited email', () => {
    expect(
      schemas.collaboratorsCreateInviteRequestSchema.parse({ email: 'Bob@Example.COM' }).email,
    ).toBe('bob@example.com')
  })

  it('only accepts a 64-character hex invite token', () => {
    const valid = 'a'.repeat(schemas.COLLABORATOR_INVITE_TOKEN_HEX_LENGTH)

    expect(schemas.collaboratorsAcceptInviteRequestSchema.safeParse({ token: valid }).success).toBe(
      true,
    )
    expect(
      schemas.collaboratorsAcceptInviteRequestSchema.safeParse({ token: 'z'.repeat(64) }).success,
    ).toBe(false)
    expect(schemas.collaboratorsAcceptInviteRequestSchema.safeParse({ token: 'aa' }).success).toBe(
      false,
    )
  })
})

describe('item requests', () => {
  it('limits categories to the maximum per item', () => {
    const categories = [ID, OTHER_ID, SOURCE_ID]

    expect(schemas.listsAddProductRequestSchema.safeParse({ name: 'a', categories }).success).toBe(
      false,
    )
  })

  it('accepts clearImage on the admin update only', () => {
    expect(schemas.adminItemsUpdateRequestSchema.safeParse({ clearImage: true }).success).toBe(true)
    expect(
      schemas.listsAddProductRequestSchema.safeParse({ name: 'a', clearImage: true }).success,
    ).toBe(false)
  })

  it('no longer exposes the user item create, item update and list item create contracts', () => {
    expect('itemsCreateRequestSchema' in schemas).toBe(false)
    expect('itemsUpdateRequestSchema' in schemas).toBe(false)
    expect('itemsUpdateResponseSchema' in schemas).toBe(false)
    expect('listItemsCreateRequestSchema' in schemas).toBe(false)
  })

  it('lets an admin set, correct and clear the gtin', () => {
    expect(
      schemas.adminItemsCreateRequestSchema.parse({ name: 'a', sources: [{}] }).gtin,
    ).toBeNull()
    expect(
      schemas.adminItemsCreateRequestSchema.parse({
        name: 'a',
        gtin: '4006381333931',
        sources: [{}],
      }).gtin,
    ).toBe('04006381333931')
    expect(schemas.adminItemsUpdateRequestSchema.parse({ gtin: '96385074' }).gtin).toBe(
      '00000096385074',
    )
    expect(schemas.adminItemsUpdateRequestSchema.parse({ gtin: null }).gtin).toBeNull()
  })
})

describe('gtin', () => {
  it('left-pads every GTIN length to 14 digits so UPC and EAN of a product match', () => {
    const upc = schemas.itemGtinSchema.parse('036000291452')
    const ean = schemas.itemGtinSchema.parse('0036000291452')

    expect(upc).toBe('00036000291452')
    expect(ean).toBe(upc)
    expect(schemas.itemGtinSchema.parse(' 96385074 ')).toBe('00000096385074')
    expect(schemas.itemGtinSchema.parse('10036000291459')).toHaveLength(schemas.GTIN_LENGTH)
  })

  it('rejects a wrong check digit', () => {
    const result = schemas.itemGtinSchema.safeParse('4006381333932')

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('gtin check digit is invalid')
  })

  it('rejects lengths that are not a GTIN and non-digit characters', () => {
    for (const value of ['1234567', '12345678901', '123456789012345', '40063813339a1']) {
      expect(schemas.itemGtinSchema.safeParse(value).success).toBe(false)
    }
  })
})

describe('add item to list requests', () => {
  it('accepts an itemId with an optional source URL', () => {
    expect(
      schemas.listsAddItemRequestSchema.parse({
        itemId: ID,
        sourceUrl: 'https://shop.example.com/p/1',
      }),
    ).toEqual({ itemId: ID, sourceUrl: 'https://shop.example.com/p/1' })
  })

  it('accepts a product payload, normalizing the gtin and defaulting the currency', () => {
    expect(
      schemas.listsAddItemRequestSchema.parse({
        name: ' Headphones ',
        gtin: '036000291452',
        price: '19.99',
        quantityDesired: 2,
      }),
    ).toEqual({
      name: 'Headphones',
      gtin: '00036000291452',
      price: '19.99',
      currency: schemas.DEFAULT_SOURCE_CURRENCY,
      quantityDesired: 2,
    })
  })

  it('rejects an itemId together with a product, or neither, with a targeted message', () => {
    for (const body of [{ itemId: ID, name: 'Headphones' }, {}]) {
      const result = schemas.listsAddItemRequestSchema.safeParse(body)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0]?.message).toBe(schemas.ADD_ITEM_TARGET_MESSAGE)
    }
  })

  it('rejects product-only fields sent with an itemId', () => {
    expect(schemas.listsAddItemRequestSchema.safeParse({ itemId: ID, price: '1.00' }).success).toBe(
      false,
    )
  })

  it('reports field errors of a product on their own path', () => {
    const result = schemas.listsAddItemRequestSchema.safeParse({
      name: 'Headphones',
      sourceUrl: 'http://shop.example.com/p/1',
    })

    expect(result.error?.issues[0]?.path).toEqual(['sourceUrl'])
  })

  it('describes the already-in-list conflict metadata', () => {
    expect(
      schemas.listItemAlreadyExistsMetadataSchema.parse({ listItemId: ID, quantityDesired: 3 }),
    ).toEqual({ listItemId: ID, quantityDesired: 3 })
  })
})

describe('list item requests', () => {
  const tooLongCustomName = 'a'.repeat(schemas.MAX_CUSTOM_NAME_LENGTH + 1)

  it('accepts a customName on add-item and update', () => {
    expect(
      schemas.listsAddItemRequestSchema.parse({ itemId: ID, customName: ' Gift ' }).customName,
    ).toBe('Gift')
    expect(
      schemas.listsAddItemRequestSchema.parse({ name: 'Headphones', customName: 'Gift' })
        .customName,
    ).toBe('Gift')
    expect(schemas.listItemsUpdateRequestSchema.parse({ customName: 'Gift' }).customName).toBe(
      'Gift',
    )
  })

  it('turns a blank customName into null so it can be cleared', () => {
    expect(schemas.listItemsUpdateRequestSchema.parse({ customName: '  ' }).customName).toBeNull()
    expect(schemas.listItemsUpdateRequestSchema.parse({ customName: null }).customName).toBeNull()
  })

  it('bounds the customName length with an explicit message', () => {
    const atMax = 'a'.repeat(schemas.MAX_CUSTOM_NAME_LENGTH)
    const result = schemas.listItemsUpdateRequestSchema.safeParse({
      customName: tooLongCustomName,
    })

    expect(schemas.listItemsUpdateRequestSchema.safeParse({ customName: atMax }).success).toBe(true)
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      `customName must be at most ${String(schemas.MAX_CUSTOM_NAME_LENGTH)} characters`,
    )
    expect(
      schemas.listsAddItemRequestSchema.safeParse({ itemId: ID, customName: tooLongCustomName })
        .success,
    ).toBe(false)
  })
})

describe('reservation requests', () => {
  const base = { listItemId: ID, quantityBooked: 1 }

  it('normalizes omitted identity fields to null and lowercases the email', () => {
    expect(schemas.reservationsCreateRequestSchema.parse(base)).toEqual({
      ...base,
      reserverName: null,
      reserverEmail: null,
    })
    expect(
      schemas.reservationsCreateRequestSchema.parse({
        ...base,
        reserverName: 'Bob',
        reserverEmail: 'BOB@example.com',
      }).reserverEmail,
    ).toBe('bob@example.com')
  })

  it('requires a name when an email is given', () => {
    const result = schemas.reservationsCreateRequestSchema.safeParse({
      ...base,
      reserverEmail: 'bob@example.com',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['reserverEmail'])
  })

  it('rejects a zero quantity', () => {
    expect(
      schemas.reservationsCreateRequestSchema.safeParse({ ...base, quantityBooked: 0 }).success,
    ).toBe(false)
  })
})

describe('user requests', () => {
  it('rejects a new password equal to the current one', () => {
    const result = schemas.usersChangePasswordRequestSchema.safeParse({
      currentPassword: 'same-password',
      newPassword: 'same-password',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['newPassword'])
  })

  it('accepts a null username to clear it', () => {
    expect(schemas.usersUpdateProfileRequestSchema.parse({ username: null }).username).toBeNull()
  })
})

describe('feedback requests', () => {
  it('rejects a context above the serialized byte limit, counted in UTF-8', () => {
    const multibyte = 'é'.repeat(schemas.MAX_FEEDBACK_CONTEXT_BYTES / 2 + 1)

    expect(
      schemas.feedbackCreateRequestSchema.safeParse({
        title: 'a',
        description: 'b',
        context: { note: multibyte },
      }).success,
    ).toBe(false)
  })

  it('accepts a null context', () => {
    expect(
      schemas.feedbackCreateRequestSchema.parse({ title: 'a', description: 'b', context: null })
        .context,
    ).toBeNull()
  })
})

describe('admin requests', () => {
  it('applies the shop write defaults and normalizes the domain', () => {
    expect(
      schemas.adminShopsCreateRequestSchema.parse({
        slug: 'my-shop',
        name: 'My shop',
        domain: 'https://WWW.Example.com/path',
      }),
    ).toEqual({
      slug: 'my-shop',
      name: 'My shop',
      domain: 'example.com',
      logoUrl: null,
      isAffiliated: false,
      sortOrder: 0,
    })
  })

  it('requires an HTTPS shop logo', () => {
    expect(
      schemas.adminShopsUpdateRequestSchema.safeParse({ logoUrl: 'http://example.com/l.png' })
        .success,
    ).toBe(false)
  })

  it('defaults a new source to EUR and validates the price format', () => {
    expect(schemas.adminItemsCreateSourceRequestSchema.parse({ price: '9.99' })).toEqual({
      shopId: null,
      sourceUrl: null,
      price: '9.99',
      currency: 'EUR',
    })
    expect(schemas.adminItemsCreateSourceRequestSchema.safeParse({ price: '9.999' }).success).toBe(
      false,
    )
  })

  it('requires at least one source on an admin item', () => {
    expect(
      schemas.adminItemsCreateRequestSchema.safeParse({ name: 'a', sources: [] }).success,
    ).toBe(false)
  })

  it('reports every source sharing a shop, and ignores null-shop sources', () => {
    const result = schemas.adminItemsCreateRequestSchema.safeParse({
      name: 'a',
      sources: [{ shopId: ID }, { shopId: ID }, { shopId: null }, { shopId: null }],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toEqual([
      'sources.0.shopId',
      'sources.1.shopId',
    ])
    expect(result.error?.issues[0]?.message).toBe(schemas.DUPLICATE_SHOP_IN_SOURCES_MESSAGE)
  })

  it('requires both translations on category creation and at least one on update', () => {
    expect(
      schemas.adminCategoriesCreateRequestSchema.safeParse({ name: { fr: 'a' }, slug: 'ab' })
        .success,
    ).toBe(false)
    expect(schemas.adminCategoriesUpdateRequestSchema.safeParse({ name: {} }).success).toBe(false)
    expect(
      schemas.adminCategoriesUpdateRequestSchema.safeParse({ name: { en: 'a' } }).success,
    ).toBe(true)
  })

  it('requires the default locale on an occasion type and refuses duplicates', () => {
    const create = (translations: { locale: string; label: string }[]): boolean =>
      schemas.adminOccasionTypesCreateRequestSchema.safeParse({ slug: 'ab', translations }).success

    expect(create([{ locale: 'fr', label: 'a' }])).toBe(false)
    expect(
      create([
        { locale: 'en', label: 'a' },
        { locale: 'en', label: 'b' },
      ]),
    ).toBe(false)
    expect(create([{ locale: 'en', label: 'a' }])).toBe(true)
  })

  it('refuses to remove the default occasion type translation', () => {
    const update = (locale: string): boolean =>
      schemas.adminOccasionTypesUpdateRequestSchema.safeParse({
        translations: [{ locale, label: null }],
      }).success

    expect(update('en')).toBe(false)
    expect(update('fr')).toBe(true)
  })

  it('does not expose ban fields on the admin user update', () => {
    expect(
      schemas.adminUsersUpdateRequestSchema.parse({ bannedAt: CREATED_AT_ISO, banReason: 'spam' }),
    ).toEqual({})
  })
})
