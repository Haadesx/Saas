#!/usr/bin/env python3
import socket
import time

def test_websocket_connection():
    try:
        # Create a TCP socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect(('localhost', 3000))
        
        # Send WebSocket upgrade request
        request = (
            "GET /ws HTTP/1.1\r\n" +
            "Host: localhost:3000\r\n" +
            "Upgrade: websocket\r\n" +
            "Connection: Upgrade\r\n" +
            "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n" +
            "Sec-WebSocket-Version: 13\r\n" +
            "\r\n"
        )
        
        sock.send(request.encode())
        
        # Receive response
        response = sock.recv(4096).decode()
        print("WebSocket upgrade response:")
        print(response)
        
        if "101 Switching Protocols" in response:
            print("✅ WebSocket connection successful!")
            return True
        else:
            print("❌ WebSocket connection failed")
            return False
            
    except Exception as e:
        print(f"❌ WebSocket test failed: {e}")
        return False
    finally:
        sock.close()

if __name__ == "__main__":
    test_websocket_connection()
