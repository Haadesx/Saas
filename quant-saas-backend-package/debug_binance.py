#!/usr/bin/env python3
import asyncio
import websockets
import json
import time

async def debug_connection():
    print("🔍 Debugging Binance Connection")
    print("=" * 35)
    
    try:
        # Test direct connection to Binance
        print("Testing direct connection to Binance WebSocket...")
        
        async with websockets.connect('wss://stream.binance.com:9443/ws/btcusdt@trade') as ws:
            print("✅ Direct Binance connection successful!")
            
            # Receive a few messages
            for i in range(3):
                message = await ws.recv()
                data = json.loads(message)
                print(f"📊 Binance raw data: {json.dumps(data, indent=2)}")
                
            print("🎉 Binance API is accessible and working!")
            return True
            
    except Exception as e:
        print(f"❌ Direct Binance connection failed: {e}")
        print("This suggests a network or connectivity issue")
        return False

async def main():
    success = await debug_connection()
    
    print("\n" + "=" * 35)
    if success:
        print("✅ Binance API is working - issue is in our backend")
        print("🔧 Need to fix the backend Binance integration")
    else:
        print("❌ Binance API not accessible - network issue")
    print("=" * 35)

if __name__ == "__main__":
    asyncio.run(main())
