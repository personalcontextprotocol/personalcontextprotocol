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
      \"grantId\": \"grant_demo_assistant\",
      \"proposedItem\": {
        \"type\": \"DecisionHistory\",
        \"content\": {
          \"text\": \"The user wants planning summaries to separate confirmed facts from assumptions.\"
        },
        \"tags\": [\"planning\", \"decision\"],
        \"confidence\": 0.9,
        \"sensitivity\": \"low\",
        \"source\": {
          \"type\": \"client_proposal\",
          \"origin\": \"sample-assistant\",
          \"method\": \"explicit_conversation_summary\",
          \"capturedAt\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"
        },
        \"freshness\": {
          \"lastVerifiedAt\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\",
          \"status\": \"fresh\"
        }
      },
      \"reason\": \"This planning preference may be useful in future sessions.\"
    }
  }"
