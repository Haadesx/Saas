#!/usr/bin/env python3
import asyncio
import websockets
import json

async def test_websocket():
    try:
        async with websockets.connect('ws://localhost:3000/ws') as websocket:
            print("WebSocket connection established!")
            
            # Send a test message
            test_msg = {"action": "test", "data": "hello"}
            await websocket.send(json.dumps(test_msg))
            print(f"Sent: {test_msg}")
            
            # Receive response
            response = await websocket.recv()
            print(f"Received: {response}")
            
            print("WebSocket test successful!")
            
    except Exception as e:
        print(f"WebSocket test failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_websocket())
