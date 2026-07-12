#!/usr/bin/env bash
set -euo pipefail

curl -s http://127.0.0.1:8787/pcp \
  -H 'content-type: application/json' \
  -H 'authorization: Bearer pcp_demo_token' \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "initialize",
    "params": {
      "protocolVersion": "2026-06-24",
      "clientInfo": {
        "id": "sample-assistant",
        "name": "Sample Assistant",
        "version": "0.1.0",
        "description": "Local assistant demo",
        "type": "local_cli"
      },
      "capabilities": {
        "context": {},
        "memory": { "propose": true }
      }
    }
  }'
