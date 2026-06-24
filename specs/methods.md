# Methods

## initialize

Negotiates protocol version and returns server capabilities.

## pcp.context.request

Returns a scoped ContextPack for a declared purpose and task.

Requires `context.read`.

## pcp.context.search

Searches context available under the grant.

Requires `context.search`.

## pcp.memory.propose

Stores a pending memory proposal.

Requires `memory.propose`.

## pcp.memory.create

Creates a ContextItem directly.

Requires `memory.write`. In the reference server this is limited to demo admin
credentials.

## pcp.consent.list

Returns grants belonging to the authenticated client.

Requires `consent.read`.

## pcp.consent.revoke

Revokes a grant owned by the authenticated client.

Requires `consent.revoke`.

## pcp.export.create

Exports permitted context as JSON.

Requires `context.export`.
