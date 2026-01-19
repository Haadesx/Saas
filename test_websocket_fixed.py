#!/usr/bin/env python3
import asyncio
import websockets
import json
import time
import requests

def test_http_endpoints():
    print("🔍 Testing HTTP Endpoints")
    print("=" * 30)
    
    endpoints = [
        ('/', 'Main'),
        ('/health', 'Health'),
        ('/api/market_data', 'Market Data')
    ]
    
    for endpoint, name in endpoints:
        try:
            response = requests.get(f'http://localhost:3000{endpoint}', timeout=5)
            print(f"✅ {name}: {response.status_code}")
        except Exception as e:
            print(f"❌ {name}: Error - {e}")

async def test_websocket_connection():
    print("\n🔍 Testing WebSocket Connection")
    print("=" * 35)
    
    try:
        # Connect without timeout parameter in connect()
        async with websockets.connect('ws://localhost:3000/ws') as websocket:
            print("✅ WebSocket connection established")
            
            # Send subscription message
            subscribe_msg = json.dumps({
                "action": "subscribe",
                "symbols": ["BTC/USDT"],
                "exchange": "binance"
            })
            await websocket.send(subscribe_msg)
            print("✅ Subscription message sent")
            
            # Wait for messages with a timeout
            start_time = time.time()
            message_count = 0
            binance_count = 0
            
            while time.time() - start_time < 15:
                try:
                    # Use asyncio.wait_for with a timeout
                    response = await asyncio.wait_for(websocket.recv(), timeout=1.0)
                    message_count += 1
                    
                    try:
                        data = json.loads(response)
                        if data.get('exchange') == 'binance':
                            binance_count += 1
                            print(f"📊 Binance Data: {data.get('symbol')} @ {data.get('price')}")
                            
                            if binance_count >= 3:
                                break
                        elif data.get('type') == 'exchange_status':
                            print(f"🔄 Exchange Status: {data.get('status')}")
                        else:
                            print(f"📊 Other Data: {data}")
                            
                    except json.JSONDecodeError:
                        print(f"📊 Raw message: {response[:50]}...")
                        
                except asyncio.TimeoutError:
                    continue
                except Exception as e:
                    print(f"⚠️  WebSocket error: {e}")
                    break
            
            print(f"✅ Total messages: {message_count}")
            print(f"✅ Binance messages: {binance_count}")
            
            if message_count > 0:
                print("🎉 WebSocket communication successful!")
                return True
            else:
                print("⚠️  No messages received")
                return False
                
    except Exception as e:
        print(f"❌ WebSocket connection failed: {e}")
        return False

async def main():
    print("🚀 Quant-SaaS WebSocket Test")
    print("=" * 45)
    
    test_http_endpoints()
    success = await test_websocket_connection()
    
    print("\n" + "=" * 45)
    if success:
        print("🎉 WebSocket test completed successfully!")
        print("✅ System communication working")
    else:
        print("❌ WebSocket test failed")
    print("=" * 45)

if __name__ == "__main__":
    asyncio.run(main())
