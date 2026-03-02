# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

---

# 🏦 Binance Trading Tools

## Trading Script

Location: `scripts/binance_trader.py`

### Commands

```bash
# Account
python3 scripts/binance_trader.py balance    # All balances
python3 scripts/binance_trader.py usdt       # USDT only

# Market Data
python3 scripts/binance_trader.py price BTCUSDT     # Current price
python3 scripts/binance_trader.py analyze BTCUSDT   # Full analysis
python3 scripts/binance_trader.py gainers           # Top gainers 24h
python3 scripts/binance_trader.py losers            # Top losers 24h

# Trading
python3 scripts/binance_trader.py buy BTCUSDT 0.001   # Market buy
python3 scripts/binance_trader.py sell BTCUSDT 0.001  # Market sell
```

### Trading Rules

1. Check balance before trading
2. Never risk >10% on single trade
3. Log all decisions with reasoning
4. Verify order execution

### Signals

- **BUY**: RSI < 30 + trend ≠ BEARISH
- **SELL**: RSI > 70 + trend ≠ BULLISH
- **HOLD**: Otherwise

### Logs

- Trades: `memory/trading/trades.json`
- Decisions: `memory/trading/decisions.json`
