#!/usr/bin/env python3
import asyncio
import websockets
import json
import time

async def monitor_binance_data():
    print("🔍 Monitoring for Binance Data")
    print("=" * 30)
    
    try:
        async with websockets.connect('ws://localhost:3000/ws') as websocket:
            print("✅ Connected to WebSocket")
            
            # Subscribe to Binance
            subscribe_msg = json.dumps({
                "action": "subscribe",
                "symbols": ["BTC/USDT"],
                "exchange": "binance"
            })
            await websocket.send(subscribe_msg)
            print("✅ Subscribed to Binance data")
            
            # Monitor for 30 seconds
            start_time = time.time()
            binance_messages = []
            
            while time.time() - start_time < 30:
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=1.0)
                    
                    try:
                        data = json.loads(response)
                        
                        # Check for Binance data
                        if data.get('exchange') == 'binance':
                            binance_messages.append(data)
                            print(f"📊 Binance: {data.get('symbol')} @ {data.get('price')} - {data.get('type')}")
                            
                            if len(binance_messages) >= 5:
                                break
                        elif data.get('type') == 'exchange_status':
                            print(f"🔄 Status: {data}")
                        else:
                            print(f"📊 Other: {data}")
                            
                    except json.JSONDecodeError:
                        print(f"📊 Raw: {response[:60]}...")
                        
                except asyncio.TimeoutError:
                    continue
            
            print(f"\n📈 Results:")
            print(f"   Binance messages received: {len(binance_messages)}")
            
            if binance_messages:
                print("🎉 Binance integration working!")
                print("Sample data:")
                for msg in binance_messages[:2]:
                    print(f"   {json.dumps(msg, indent=2)}")
                return True
            else:
                print("⚠️  No Binance data received")
                print("   This could mean:")
                print("   1. Binance WebSocket not connected")
                print("   2. Connection issue with Binance API")
                print("   3. Data not being broadcast properly")
                return False
                
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

async def main():
    print("🚀 Binance Connection Test")
    print("=" * 40)
    
    success = await monitor_binance_data()
    
    print("\n" + "=" * 40)
    if success:
        print("🎉 Binance integration confirmed working!")
    else:
        print("❌ Need to investigate Binance connection")
    print("=" * 40)

if __name__ == "__main__":
    asyncio.run(main())
