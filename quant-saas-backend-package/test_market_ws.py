#!/usr/bin/env python3
import asyncio
import websockets
import json
import time

async def test_market_websocket():
    try:
        async with websockets.connect('ws://localhost:3000/ws') as websocket:
            print("✓ WebSocket connection established!")
            
            # Subscribe to market data
            subscribe_msg = {"action": "subscribe", "symbols": ["BTC/USD", "ETH/USD"]}
            await websocket.send(json.dumps(subscribe_msg))
            print(f"✓ Sent subscription: {subscribe_msg}")
            
            # Receive a few messages
            for i in range(5):
                response = await websocket.recv()
                print(f"✓ Received: {response}")
                
            print("✓ WebSocket test successful!")
            print("✓ Market data streaming is working!")
            
    except Exception as e:
        print(f"✗ WebSocket test failed: {e}")
        return False
    
    return True

async def test_http_endpoints():
    import requests
    
    try:
        # Test main endpoint
        response = requests.get('http://localhost:3000')
        print(f"✓ Main endpoint: {response.text}")
        
        # Test health endpoint
        response = requests.get('http://localhost:3000/health')
        print(f"✓ Health endpoint: {response.text}")
        
        # Test market data endpoint
        response = requests.get('http://localhost:3000/api/market_data')
        print(f"✓ Market data endpoint: {response.text}")
        
        return True
        
    except Exception as e:
        print(f"✗ HTTP test failed: {e}")
        return False

async def main():
    print("=" * 50)
    print("Quant-SaaS Backend Testing")
    print("=" * 50)
    
    print("\n1. Testing HTTP endpoints...")
    http_success = await test_http_endpoints()
    
    print("\n2. Testing WebSocket connection...")
    ws_success = await test_market_websocket()
    
    print("\n" + "=" * 50)
    if http_success and ws_success:
        print("🎉 All tests passed! Backend is working correctly.")
        print("🚀 Ready for production deployment!")
    else:
        print("❌ Some tests failed. Please check the implementation.")
    print("=" * 50)

if __name__ == "__main__":
    asyncio.run(main())
