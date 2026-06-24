#!/usr/bin/env bash
set -euo pipefail

curl -s http://127.0.0.1:8787/pcp \
  -H 'content-type: application/json' \
  -H 'authorization: Bearer pcp_demo_token' \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"id\": \"4\",
    \"method\": \"pcp.memory.propose\",
    \"params\": {
      \"grantId\": \"grant_demo_codex\",
      \"proposedItem\": {
        \"type\": \"DecisionHistory\",
        \"content\": {
          \"text\": \"The user decided PCP v0.1 should use JSON-RPC over HTTP with scoped ContextPacks, consent grants, and memory proposals.\"
        },
        \"tags\": [\"pcp\", \"protocol\", \"decision\"],
        \"confidence\": 0.9,
        \"sensitivity\": \"low\",
        \"source\": {
          \"type\": \"client_proposal\",
          \"origin\": \"codex-local\",
          \"method\": \"explicit_conversation_summary\",
          \"capturedAt\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"
        },
        \"freshness\": {
          \"lastVerifiedAt\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\",
          \"status\": \"fresh\"
        }
      },
      \"reason\": \"This decision is useful for future PCP implementation continuity.\"
    }
  }"
