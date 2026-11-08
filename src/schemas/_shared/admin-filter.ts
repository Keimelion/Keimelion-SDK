export const ADMIN_FILTER_OPERATORS = [
  'eq',
  'in',
  'gte',
  'lte',
  'between',
  'ilike',
  'isNull',
] as const

export type AdminFilterOperator = (typeof ADMIN_FILTER_OPERATORS)[number]

export type AdminFilterConfig = Readonly<Record<string, readonly AdminFilterOperator[]>>

type AdminFilterListOperator = 'in' | 'between'

type AdminFilterScalarKey<TConfig extends AdminFilterConfig> = {
  [
    TField in keyof TConfig & string
  ]: `${TField}[${Exclude<TConfig[TField][number], AdminFilterListOperator>}]`
}[keyof TConfig & string]

type AdminFilterListKey<TConfig extends AdminFilterConfig> = {
  [
    TField in keyof TConfig & string
  ]: `${TField}[${Extract<TConfig[TField][number], AdminFilterListOperator>}][]`
}[keyof TConfig & string]

// Bracket filters of the admin list endpoints, e.g. `{ 'email[ilike]': 'jane' }`.
// `in` and `between` keys end with `[]` so that a single value still reaches the API as an array.
export type AdminFilterQuery<TConfig extends AdminFilterConfig> = Partial<
  Record<AdminFilterScalarKey<TConfig>, string | number | boolean | undefined>
> &
  Partial<Record<AdminFilterListKey<TConfig>, readonly (string | number)[] | undefined>>
