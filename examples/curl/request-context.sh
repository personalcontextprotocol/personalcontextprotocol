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
      "grantId": "grant_demo_assistant",
      "purpose": "Help the user prepare for a planning session",
      "task": "Summarize current goals, preferences, and relevant decisions",
      "contextTypes": ["UserProfile", "Project", "Preference", "Goal", "DecisionHistory", "CommunicationStyle", "MemoryItem"],
      "maxItems": 20,
      "freshnessPreference": "recent_first",
      "includeSources": true,
      "includeConfidence": true
    }
  }'
