#!/bin/bash
# Simple WebSocket test using curl (not ideal but works for basic testing)
echo "Testing WebSocket connection..."
sleep 2
curl -v -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Host: localhost:3000" -H "Origin: http://localhost:3000" http://localhost:3000/ws
