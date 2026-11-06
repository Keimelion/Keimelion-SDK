export const DUPLICATE_SHOP_IN_SOURCES_MESSAGE =
  'This shop is already used by another source of this item.'

export const SLUG_GENERATION_EXHAUSTED_MESSAGE =
  'Could not generate a unique slug, please retry with a different title.'

export const MAX_CATEGORY_DEPTH = 3

export const CATEGORY_NOT_FOUND_MESSAGE = 'Category not found'

export const CATEGORY_MAX_DEPTH_EXCEEDED_MESSAGE = `Category depth cannot exceed ${String(MAX_CATEGORY_DEPTH)} levels`

export const CATEGORY_CYCLE_DETECTED_MESSAGE =
  'Category parent cannot create a cycle in the hierarchy'

export const TAG_NOT_FOUND_MESSAGE = 'Tag not found'

export const TAG_INVALID_NAME_MESSAGE =
  'Tag name must contain at least one letter or digit after normalization'

export const FEEDBACK_NOT_FOUND_MESSAGE = 'Feedback not found'

export const COLLAB_SELF_INVITE_MESSAGE =
  'You cannot invite yourself to collaborate on your own list'

export const COLLAB_ALREADY_MEMBER_MESSAGE =
  'This list already has an active editor invitation or collaborator'

export const COLLAB_INVITE_NOT_FOUND_MESSAGE = 'Invitation not found'

export const COLLAB_INVITE_EXPIRED_MESSAGE = 'This invitation has expired'

export const COLLAB_INVITE_ALREADY_RESOLVED_MESSAGE =
  'This invitation has already been accepted or revoked'

export const COLLAB_EMAIL_MISMATCH_MESSAGE =
  'This invitation was issued to a different email address'

export const RESERVATION_TOKEN_INVALID_MESSAGE =
  'The reservation token is invalid for this reservation'

export const RESERVATION_REQUIRES_RESERVER_NAME_MESSAGE =
  'reserverName is required when reserving without an account'

export const RESERVATION_INCONSISTENT_INTENT_MESSAGE =
  'Only the list owner may reserve on behalf of someone else (reserverName)'

export const REPORT_TARGET_NOT_FOUND_MESSAGE = 'The reported user, list or item does not exist'

export const REPORT_NOT_FOUND_MESSAGE = 'Report not found'
