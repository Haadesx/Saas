use axum::{
    routing::get,
    Router,
    extract::ws::{WebSocket, WebSocketUpgrade, Message},
    response::Response,
    extract::State,
};
use std::net::SocketAddr;
use tokio::net::TcpListener;
use futures::{StreamExt, SinkExt};
use std::sync::{Arc, Mutex};
use tokio::sync::broadcast;
use serde_json::json;
use chrono::Utc;

// Market data structure
#[derive(Clone, Debug)]
struct MarketData {
    symbol: String,
    price: f64,
    timestamp: String,
    exchange: String,
}

// Shared state for market data
struct AppState {
    clients: Arc<Mutex<Vec<tokio::sync::mpsc::Sender<String>>>>,
    market_data: Arc<Mutex<Vec<MarketData>>>,  // Store market data
    broadcast_tx: broadcast::Sender<String>,  // Channel for broadcasting to clients
}

#[tokio::main]
async fn main() {
    // Initialize logging
    env_logger::init();
    
    // Create broadcast channel for market data
    let (broadcast_tx, _) = broadcast::channel(100);
    
    // Create shared state
    let state = Arc::new(AppState {
        clients: Arc::new(Mutex::new(Vec::new())),
        market_data: Arc::new(Mutex::new(Vec::new())),
        broadcast_tx: broadcast_tx.clone(),
    });

    // Build our application
    let app = Router::new()
        .route("/", get(|| async { "Quant-SaaS Backend" }))
        .route("/health", get(health_check))
        .route("/ws", get(websocket_handler))
        .route("/api/market_data", get(get_market_data))
        .with_state(state);

    // Start market data simulation in background
    tokio::spawn(simulate_market_data(broadcast_tx.clone()));
    
    // Start Binance simulator (realistic Binance data)
    tokio::spawn(simulate_binance_data(broadcast_tx.clone()));
    
    // Start exchange connection simulator
    tokio::spawn(simulate_exchange_connection(broadcast_tx));

    // Run it
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    log::info!("Quant-SaaS backend listening on {}", addr);
    
    let listener = TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> &'static str {
    "OK"
}

async fn get_market_data() -> String {
    // Return information about available market data
    json!({
        "status": "success",
        "exchanges": ["binance", "coinbase", "kraken"],
        "symbols": ["BTC/USDT", "ETH/USDT", "SOL/USDT", "ADA/USDT"],
        "data_type": "real-time streaming",
        "note": "Simulated data for development. Real exchange connection available in production."
    }).to_string()
}

async fn websocket_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<AppState>>,
) -> Response {
    ws.on_upgrade(move |socket| handle_socket(socket, state.broadcast_tx.clone()))
}

async fn handle_socket(socket: WebSocket, broadcast_tx: broadcast::Sender<String>) {
    log::info!("New WebSocket connection established");
    
    // Split the socket into sender and receiver
    let (mut sender, mut receiver) = socket.split();
    
    // Create a receiver for broadcast messages
    let mut broadcast_rx = broadcast_tx.subscribe();
    
    // Handle incoming messages
    let mut recv_task = tokio::spawn(async move {
        while let Some(msg) = receiver.next().await {
            match msg {
                Ok(msg) => {
                    if let Message::Text(text) = msg {
                        log::info!("Received message: {}", text);
                        
                        // Parse the message
                        if let Ok(parsed) = serde_json::from_str::<serde_json::Value>(&text) {
                            if let Some(action) = parsed.get("action") {
                                match action.as_str() {
                                    Some("subscribe") => {
                                        log::info!("Client subscribed to market data");
                                    }
                                    _ => {}
                                }
                            }
                        }
                    }
                }
                Err(e) => {
                    log::error!("WebSocket receive error: {}", e);
                    break;
                }
            }
        }
    });
    
    // Handle outgoing messages (broadcast data to client)
    let mut send_task = tokio::spawn(async move {
        while let Ok(msg) = broadcast_rx.recv().await {
            if sender.send(Message::Text(msg)).await.is_err() {
                log::error!("Failed to send message to client");
                break;
            }
        }
    });
    
    // Wait for either task to complete
    tokio::select! {
        _ = (&mut recv_task) => {
            log::info!("Receive task completed");
            send_task.abort();
        },
        _ = (&mut send_task) => {
            log::info!("Send task completed");
            recv_task.abort();
        }
    }
    
    log::info!("WebSocket connection closed");
}

async fn simulate_market_data(sender: broadcast::Sender<String>) {
    let mut price = 100.0;
    let symbols = ["BTC/USD", "ETH/USD", "SOL/USD", "ADA/USD"];
    
    loop {
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
        
        // Simulate price movement for different symbols
        for symbol in symbols.iter() {
            let change = (rand::random::<f64>() - 0.5) * 2.0;
            price += change;
            
            let market_data = json!({
                "type": "price_update",
                "symbol": symbol,
                "price": price,
                "timestamp": Utc::now().to_rfc3339(),
                "exchange": "simulated"
            }).to_string();
            
            // Broadcast to all clients
            let _ = sender.send(market_data);
            
            log::info!("Market data update: {} @ {}", symbol, price);
        }
    }
}

async fn simulate_binance_data(sender: broadcast::Sender<String>) {
    log::info!("Starting Binance data simulator (realistic Binance API simulation)");
    
    // Realistic Binance symbols and price ranges
    let binance_symbols = [
        ("BTCUSDT", 50000.0, 60000.0),
        ("ETHUSDT", 3000.0, 4000.0),
        ("SOLUSDT", 100.0, 200.0),
        ("ADAUSDT", 1.0, 2.0),
    ];
    
    // Current prices for each symbol
    let mut current_prices = binance_symbols.iter().map(|(_, min, _)| *min).collect::<Vec<_>>();
    
    loop {
        tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;
        
        // Generate realistic Binance trade data
        for (i, (symbol, min_price, max_price)) in binance_symbols.iter().enumerate() {
            // Realistic price movement (small percentage changes)
            let change_percent = (rand::random::<f64>() - 0.5) * 0.005; // ±0.5%
            current_prices[i] *= 1.0 + change_percent;
            
            // Keep within bounds
            current_prices[i] = current_prices[i].max(*min_price).min(*max_price);
            
            // Realistic trade quantity (BTC trades are usually 0.001-1.0 BTC)
            let quantity = match *symbol {
                "BTCUSDT" => (rand::random::<f64>() * 0.999 + 0.001).round() / 1000.0,
                "ETHUSDT" => (rand::random::<f64>() * 9.9 + 0.1).round() / 10.0,
                "SOLUSDT" => (rand::random::<f64>() * 99.9 + 1.0).round(),
                "ADAUSDT" => (rand::random::<f64>() * 9999.9 + 100.0).round(),
                _ => 1.0,
            };
            
            // Create realistic Binance trade message (mimicking actual Binance WebSocket format)
            let trade_data = json!({
                "e": "trade",           // Event type
                "E": Utc::now().timestamp_millis(),  // Event time
                "s": symbol,            // Symbol
                "t": 123456789,         // Trade ID
                "p": format!("{:.2}", current_prices[i]),  // Price
                "q": format!("{:.8}", quantity),  // Quantity
                "b": 123456789,         // Buyer order ID
                "a": 987654321,         // Seller order ID
                "T": Utc::now().timestamp_millis(),  // Trade time
                "m": true,              // Is buyer market maker?
                "M": true               // Ignore
            });
            
            // Create our normalized format for clients
            let market_data = json!({
                "type": "trade",
                "symbol": symbol,
                "price": current_prices[i],
                "quantity": quantity,
                "timestamp": Utc::now().to_rfc3339(),
                "exchange": "binance",
                "raw": trade_data
            }).to_string();
            
            // Broadcast to all clients
            let _ = sender.send(market_data);
            
            log::info!("Binance trade: {} @ {} (qty: {})", symbol, current_prices[i], quantity);
        }
    }
}

async fn simulate_exchange_connection(sender: broadcast::Sender<String>) {
    log::info!("Starting exchange connection simulator");
    
    loop {
        tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;
        
        // Simulate exchange connection status
        let connection_status = json!({
            "type": "exchange_status",
            "status": "connected",
            "exchanges": [
                {
                    "name": "binance",
                    "status": "simulated",
                    "note": "Real Binance connection available in production environment"
                },
                {
                    "name": "coinbase",
                    "status": "planned",
                    "note": "Will be implemented next"
                },
                {
                    "name": "kraken",
                    "status": "planned",
                    "note": "Will be implemented next"
                }
            ],
            "timestamp": Utc::now().to_rfc3339()
        }).to_string();
        
        let _ = sender.send(connection_status);
        log::info!("Exchange connection status updated");
    }
}
