import { describe, expect, expectTypeOf, it } from 'vitest'
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

describe('response conventions', () => {
  it('decodes *_at timestamps into Dates and keeps nullable ones null', () => {
    const parsed = schemas.adminUserDetailSchema.parse({
      ...buildUserDetailWire(),
      bannedAt: CREATED_AT_ISO,
      banReason: 'spam',
      deletedAt: null,
      reservationsCount: 0,
    })

    expect(parsed.bannedAt).toBeInstanceOf(Date)
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
    expectTypeOf<schemas.AdminUsersListFilters>().not.toHaveProperty('email[between][]')
    expectTypeOf<schemas.AdminUsersListFilters>().not.toHaveProperty('role[in]')
  })

  it('defaults the export format to json and rejects an unknown one', () => {
    expect(schemas.usersExportQuerySchema.parse({}).format).toBe('json')
    expect(schemas.usersExportQuerySchema.safeParse({ format: 'xml' }).success).toBe(false)
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

  it('only lets an owner archive or reactivate, while an admin can also delete', () => {
    expect(schemas.listsUpdateRequestSchema.safeParse({ listStatus: 'archived' }).success).toBe(
      true,
    )
    expect(schemas.listsUpdateRequestSchema.safeParse({ listStatus: 'deleted' }).success).toBe(
      false,
    )
    expect(schemas.adminListsUpdateRequestSchema.safeParse({ listStatus: 'deleted' }).success).toBe(
      true,
    )
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

    expect(schemas.itemsCreateRequestSchema.safeParse({ name: 'a', categories }).success).toBe(
      false,
    )
  })

  it('accepts clearImage on update only', () => {
    expect(schemas.itemsUpdateRequestSchema.safeParse({ clearImage: true }).success).toBe(true)
    expect(
      schemas.itemsCreateRequestSchema.safeParse({ name: 'a', clearImage: true }).success,
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
      isActive: true,
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
