# Authorization And Consent Profile

This page defines the draft PCP v0.1 Authorization and Consent Profile.

The profile is optional in v0.1 alpha. It describes one interoperable way for a
PCP server to let an owner approve app access, issue a client binding, and
enforce that binding on PCP method calls. It is not a hosted identity provider,
not a replacement for OAuth or OpenID Connect, and not required for the local
reference server.

Implementations MAY use OAuth, OpenID Connect, platform login, local account
auth, or another owner-authentication system around this profile. Whatever
system authenticates the owner, PCP authorization still needs a consent grant
that says what personal context a client can use.

## Concepts

- **Owner**: the person or account that controls the personal context.
- **PCP client**: an app that wants to call a PCP server.
- **Authorization request**: the app's request for owner-approved access.
- **Binding**: the result of approval, containing a client id, grant id, PCP
  endpoint, and bearer-token instructions.
- **Consent grant**: the durable PCP permission record that binds a client,
  scopes, purpose, status, expiry, and revocation state.
- **Access policy**: optional grant metadata that narrows what context the
  grant can reach beyond coarse scopes.

## Authorization Request

A PCP authorization request contains:

- `clientName`
- optional `clientUri`
- `redirectUri`
- `purpose`
- `scopes`
- optional `state`
- `codeChallenge`
- `codeChallengeMethod`, currently `S256`

The owner-facing authorization surface SHOULD show the app name, app URI when
available, redirect URI, purpose, and requested scopes before approval.

Servers SHOULD reject redirect URIs that are not HTTPS, except that local
loopback HTTP redirects MAY be accepted for local apps.

## Approval And Denial

If the owner approves, the server SHOULD issue a short-lived one-time code and
redirect back to the app's `redirectUri` with:

- `code`
- `state`, when supplied by the request

If the owner denies access, the server SHOULD redirect with:

- `error: "access_denied"`
- `state`, when supplied by the request

Approval and denial MUST be audited.

## Code Exchange

The code exchange payload contains:

- `code`
- `codeVerifier`

The server MUST verify the code challenge before returning a binding. Codes
MUST be single-use and short-lived.

The binding result contains:

- `client.id`
- `client.name`
- optional `client.clientUri`
- `grant`
- `pcp.endpoint`
- `pcp.authorization`, currently `Bearer <token>`
- optional `pcp.token`, intended for one-time display or immediate handoff

Servers that issue bearer tokens SHOULD store only token hashes or equivalent
non-reversible token verifiers.

## Grant Enforcement

For protected PCP methods, servers MUST verify:

1. bearer token or equivalent client credential is valid
2. token is bound to the calling client
3. grant exists
4. grant is bound to the calling client
5. grant status is `active`
6. grant is not expired
7. grant includes the method's required scope
8. any access policy attached to the grant allows the requested context

Failures MUST fail closed and SHOULD write denial audit entries.

## Access Policy

The v0.1 profile defines `ConsentAccessPolicy` as optional grant metadata:

```json
{
  "mode": "selected_nodes",
  "nodeIds": ["type:project", "tag:release"],
  "memoryReviewRequired": true
}
```

`mode: "all"` means the grant can reach all active context that is otherwise
allowed by PCP scopes and sensitivity rules.

`mode: "selected_nodes"` means the grant is narrowed to implementation-defined
context group identifiers. Implementations MUST document the meaning of their
node identifiers.

`memoryReviewRequired` lets a server require owner review before app-written
memory becomes generally visible.

## Revocation And Rotation

Servers SHOULD provide owner-visible controls to:

- revoke a client binding
- revoke a consent grant
- rotate a client token
- inspect recent access and denial audit events

Revocation MUST prevent future protected method access for the revoked client
or grant.

## Discovery

Servers MAY advertise support for this profile in `initialize`:

```json
{
  "capabilities": {
    "authorization": {
      "appBinding": {
        "supported": true,
        "authorizeEndpoint": "https://context.example.com/authorize",
        "tokenEndpoint": "https://context.example.com/pcp/oauth/token",
        "grantManagementEndpoint": "https://context.example.com/apps",
        "codeChallengeMethods": ["S256"]
      }
    }
  }
}
```

Clients MUST treat this field as optional. Absence means the server did not
advertise this profile during initialization.

## Reference Server Status

The v0.1 reference server keeps demo bearer auth and seeded grants. It does not
implement a production authorization server or hosted identity system.

The profile is included so independent implementations can converge on a common
authorization and consent shape while preserving PCP's consent, scope,
provenance, sensitivity, freshness, and audit requirements.
