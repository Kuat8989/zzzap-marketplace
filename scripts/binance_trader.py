#!/usr/bin/env python3
"""
Binance Trading Bot for OpenClaw AI Agents
StatArb / Pairs Trading Edition (Conservative Risk)
"""

import os
import json
import time
import math
from datetime import datetime
from binance.client import Client
from binance.enums import *

# API Configuration
API_KEY = os.environ.get('BINANCE_API_KEY', 'zd4NOde88yNZFyIs7jSJKrwC470gNUqCHb0JsU7LcUyQHlyAX6etjPyXtZF4tKJi')
API_SECRET = os.environ.get('BINANCE_SECRET_KEY', 'onoTTc3glrCS7WwYUCesmVNlOuyhJjgZ66ewKBv4aaFoOVeGJ0KAfMBz4qEiDIxM')

client = Client(API_KEY, API_SECRET)

# ==================== ACCOUNT FUNCTIONS ====================

def get_account_balance():
    account = client.get_account()
    balances = []
    for asset in account['balances']:
        free = float(asset['free'])
        locked = float(asset['locked'])
        if free > 0 or locked > 0:
            balances.append({
                'asset': asset['asset'],
                'free': free,
                'locked': locked,
                'total': free + locked
            })
    return balances

def get_usdt_balance():
    balance = client.get_asset_balance(asset='USDT')
    return {
        'free': float(balance['free']),
        'locked': float(balance['locked']),
        'total': float(balance['free']) + float(balance['locked'])
    }

# ==================== MARKET DATA FUNCTIONS ====================

def get_price(symbol):
    ticker = client.get_symbol_ticker(symbol=symbol)
    return float(ticker['price'])

def get_klines(symbol, interval='1h', limit=100):
    klines = client.get_klines(symbol=symbol, interval=interval, limit=limit)
    return [{
        'close': float(k[4]),
    } for k in klines]

# ==================== TRADING FUNCTIONS ====================

def buy_market(symbol, quantity):
    try:
        order = client.order_market_buy(symbol=symbol, quantity=quantity)
        log_trade('BUY', symbol, quantity, order)
        return order
    except Exception as e:
        return {'error': str(e)}

def sell_market(symbol, quantity):
    try:
        order = client.order_market_sell(symbol=symbol, quantity=quantity)
        log_trade('SELL', symbol, quantity, order)
        return order
    except Exception as e:
        return {'error': str(e)}

def get_open_orders(symbol=None):
    if symbol:
        return client.get_open_orders(symbol=symbol)
    return client.get_open_orders()

# ==================== ANALYSIS FUNCTIONS ====================

def calculate_mean_std(values):
    n = len(values)
    if n < 2:
        return 0, 0
    mean = sum(values) / n
    variance = sum((x - mean) ** 2 for x in values) / (n - 1)
    std_dev = math.sqrt(variance)
    return mean, std_dev

def analyze_pairs(pair1, pair2, interval='1h', limit=100):
    """
    Pairs trading analysis. Calculates the Z-score of the ratio between two correlated assets.
    """
    klines1 = get_klines(pair1, interval, limit)
    klines2 = get_klines(pair2, interval, limit)
    
    if len(klines1) != len(klines2) or len(klines1) < limit:
        return {"error": "Insufficient or mismatched data"}
    
    ratios = [k1['close'] / k2['close'] for k1, k2 in zip(klines1, klines2)]
    
    current_ratio = ratios[-1]
    historical_ratios = ratios[:-1]
    
    mean, std_dev = calculate_mean_std(historical_ratios)
    
    if std_dev == 0:
        return {"error": "Zero standard deviation"}
    
    z_score = (current_ratio - mean) / std_dev
    
    signal = 'HOLD'
    action = 'NONE'
    
    # Z-score > 2 means pair1 is overvalued relative to pair2 (Sell pair1, Buy pair2)
    # Z-score < -2 means pair1 is undervalued relative to pair2 (Buy pair1, Sell pair2)
    if z_score > 2.0:
        signal = 'ARBITRAGE_OPPORTUNITY'
        action = f'SHORT {pair1}, LONG {pair2}'
    elif z_score < -2.0:
        signal = 'ARBITRAGE_OPPORTUNITY'
        action = f'LONG {pair1}, SHORT {pair2}'
        
    return {
        'pair1': pair1,
        'pair2': pair2,
        'current_ratio': round(current_ratio, 4),
        'mean_ratio': round(mean, 4),
        'z_score': round(z_score, 2),
        'signal': signal,
        'action': action,
        'risk_level': 'LOW (Market Neutral)'
    }

def analyze_market_neutral_statarb():
    """
    Conservative Pairs Trading Scanner
    Searches for divergences in historically correlated pairs.
    """
    # Correlated pairs to monitor
    pairs_to_check = [
        ('BTCUSDT', 'ETHUSDT'),   # The classic crypto pair
        ('ADAUSDT', 'DOTUSDT'),   # L1s
        ('UNIUSDT', 'AAVEUSDT'),  # DeFi
        ('MATICUSDT', 'LINKUSDT') # Infrastracture/L2
    ]
    
    results = []
    usdt_balance = get_usdt_balance()['total']
    
    for p1, p2 in pairs_to_check:
        try:
            analysis = analyze_pairs(p1, p2)
            if "error" not in analysis:
                results.append(analysis)
        except Exception as e:
            continue
            
    # Sort by absolute z-score (biggest divergence first)
    results.sort(key=lambda x: abs(x['z_score']), reverse=True)
    
    return {
        'strategy': 'STAT-ARB / PAIRS TRADING (CONSERVATIVE) 🛡️',
        'balance_usdt': usdt_balance,
        'opportunities': results,
        'timestamp': datetime.now().isoformat(),
        'status': 'AUTO_EXECUTION_ACTIVE' # Chief is now in control
    }

def analyze_portfolio():
    """
    Portfolio Manager Agent.
    Evaluates non-USDT assets and decides what to do with them.
    """
    account_balances = get_account_balance()
    usdt_balance = get_usdt_balance()['total']
    
    portfolio_value = usdt_balance
    assets_report = []
    
    for asset_data in account_balances:
        asset = asset_data['asset']
        if asset == 'USDT' or asset.startswith('LD'): # Ignore Earn/Locked assets temporarily
            continue
            
        free_amount = asset_data['free']
        if free_amount == 0:
            continue
            
        symbol = f"{asset}USDT"
        
        try:
            # Check if USDT pair exists and get price
            price = get_price(symbol)
            usdt_value = free_amount * price
            portfolio_value += usdt_value
            
            # Skip dust
            if usdt_value < 1.0:
                assets_report.append({
                    'asset': asset,
                    'amount': free_amount,
                    'usdt_value': round(usdt_value, 2),
                    'status': 'DUST (Cannot sell on spot)'
                })
                continue
                
            # Get 24h stats to make a decision
            stats = client.get_ticker(symbol=symbol)
            change_24h = float(stats['priceChangePercent'])
            
            # Autonomous AI Logic for Portfolio Management:
            # 1. If it pumped > 10% in 24h, SELL to lock in profit.
            # 2. If it's bleeding (<-5%), SELL to cut losses and free up capital.
            # 3. Otherwise, HOLD for better opportunities.
            
            decision = "HOLD"
            reason = "Awaiting significant movement"
            
            if change_24h > 10.0:
                decision = "SELL"
                reason = f"Taking profit (+{change_24h}%)"
            elif change_24h < -5.0:
                decision = "SELL"
                reason = f"Cutting losses ({change_24h}%) to free up USDT"
            
            # Note: Binance min notional is $5. If < $5, spot sell will fail.
            if usdt_value < 5.0 and decision == "SELL":
                decision = "HOLD"
                reason = f"Value too low (${round(usdt_value, 2)} < $5 min order size)"
                
            assets_report.append({
                'asset': asset,
                'symbol': symbol,
                'amount': free_amount,
                'usdt_value': round(usdt_value, 2),
                'change_24h': change_24h,
                'decision': decision,
                'reasoning': reason
            })
            
            # Execute AUTO SELL if conditions are met
            if decision == "SELL":
                # Only simulated execution here or actual execution
                # order = sell_market(symbol, free_amount)
                pass # Wait for explicit command or let agent do it in a full auto loop
                
        except Exception as e:
            # Pair might not exist or other error
            pass
            
    return {
        'total_portfolio_value_usdt': round(portfolio_value, 2),
        'free_usdt': round(usdt_balance, 2),
        'assets_managed': assets_report,
        'timestamp': datetime.now().isoformat()
    }

# ==================== LOGGING FUNCTIONS ====================

def log_trade(action, symbol, quantity, order, price=None):
    log_dir = os.path.expanduser('~/.openclaw/workspace/memory/trading')
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, 'trades.json')
    
    trade = {
        'timestamp': datetime.now().isoformat(),
        'action': action,
        'symbol': symbol,
        'quantity': quantity,
        'price': price,
        'order_id': order.get('orderId'),
        'status': order.get('status')
    }
    
    trades = []
    if os.path.exists(log_file):
        with open(log_file, 'r') as f:
            trades = json.load(f)
    trades.append(trade)
    with open(log_file, 'w') as f:
        json.dump(trades, f, indent=2)

def log_decision(agent, decision, reasoning):
    log_dir = os.path.expanduser('~/.openclaw/workspace/memory/trading')
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, 'decisions.json')
    
    entry = {
        'timestamp': datetime.now().isoformat(),
        'agent': agent,
        'decision': decision,
        'reasoning': reasoning
    }
    
    decisions = []
    if os.path.exists(log_file):
        with open(log_file, 'r') as f:
            decisions = json.load(f)
    decisions.append(entry)
    with open(log_file, 'w') as f:
        json.dump(decisions, f, indent=2)

# ==================== MAIN ====================

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        print('Usage: python binance_trader.py <command> [args]')
        print('Commands:')
        print('  balance - Get account balance')
        print('  usdt - Get USDT balance only')
        print('  price <symbol> - Get current price')
        print('  analyze <pair1> <pair2> - Analyze a statistical pair (e.g., BTCUSDT ETHUSDT)')
        print('  statarb - 🛡️ Сканирование рынка на парный арбитраж (StatArb)')
        print('  portfolio - 💼 Портфельный менеджер: анализ и ребалансировка')
        print('  buy <symbol> <quantity> - Market buy')
        print('  sell <symbol> <quantity> - Market sell')
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == 'balance':
        print(json.dumps(get_account_balance(), indent=2))
    
    elif command == 'usdt':
        print(json.dumps(get_usdt_balance(), indent=2))
    
    elif command == 'price' and len(sys.argv) > 2:
        symbol = sys.argv[2].upper()
        print(f'{symbol}: {get_price(symbol)}')
    
    elif command == 'analyze' and len(sys.argv) > 3:
        p1 = sys.argv[2].upper()
        p2 = sys.argv[3].upper()
        print(json.dumps(analyze_pairs(p1, p2), indent=2))
        
    elif command == 'statarb':
        print(json.dumps(analyze_market_neutral_statarb(), indent=2))
        
    elif command == 'portfolio':
        print(json.dumps(analyze_portfolio(), indent=2))
    
    elif command == 'buy' and len(sys.argv) > 3:
        symbol = sys.argv[2].upper()
        quantity = float(sys.argv[3])
        print(json.dumps(buy_market(symbol, quantity), indent=2))
    
    elif command == 'sell' and len(sys.argv) > 3:
        symbol = sys.argv[2].upper()
        quantity = float(sys.argv[3])
        print(json.dumps(sell_market(symbol, quantity), indent=2))
    
    else:
        print(f'Unknown command or missing arguments: {command}')