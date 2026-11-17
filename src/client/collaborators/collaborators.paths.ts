export const CollaboratorsPaths = {
  CREATE_INVITE: '/v1/lists/:id/collaborators/invites',
  REVOKE_INVITE: '/v1/lists/:id/collaborators/invites/:inviteId',
  REMOVE_COLLABORATOR: '/v1/lists/:id/collaborators/:userId',
  LEAVE_LIST: '/v1/lists/:id/collaborators/me',
  ACCEPT_INVITE: '/v1/collaborators/invites/accept',
  DECLINE_INVITE: '/v1/collaborators/invites/decline',
} as const
