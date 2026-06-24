#!/usr/bin/env bash
set -euo pipefail

curl -s http://127.0.0.1:8787/pcp \
  -H 'content-type: application/json' \
  -H 'authorization: Bearer pcp_demo_token' \
  -d '{
    "jsonrpc": "2.0",
    "id": "2",
    "method": "pcp.context.request",
    "params": {
      "grantId": "grant_demo_codex",
      "purpose": "Help the user continue PCP design and implementation",
      "task": "Implement PCP v0.1 reference server",
      "contextTypes": ["UserProfile", "Project", "Preference", "Goal", "DecisionHistory", "CommunicationStyle", "MemoryItem"],
      "maxItems": 20,
      "freshnessPreference": "recent_first",
      "includeSources": true,
      "includeConfidence": true
    }
  }'
