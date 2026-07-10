#!/usr/bin/env bash
set -euo pipefail

curl -s http://127.0.0.1:8787/pcp \
  -H 'content-type: application/json' \
  -H 'authorization: Bearer pcp_demo_token' \
  -d '{
    "jsonrpc": "2.0",
    "id": "3",
    "method": "pcp.context.search",
    "params": {
      "grantId": "grant_demo_assistant",
      "query": "planning decisions",
      "contextTypes": ["Project", "DecisionHistory", "MemoryItem"],
      "limit": 10
    }
  }'
