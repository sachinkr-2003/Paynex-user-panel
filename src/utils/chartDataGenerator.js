/**
 * Professional Real-Time Market Chart Data Generator
 * Provides 100% offline-resilient, deterministic synthetic candles and market statistics
 * Seeded by symbol and timeframe so that each company has a stable, consistent, realistic chart curve.
 */

function createSeededRandom(seedStr) {
  let h = 0xdeadbeef;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 2654435761);
  }
  let s = h >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateRealisticCandles(
  rawBasePrice = 1250,
  rawSymbol = 'RELIANCE',
  timeframe = '1D',
  count = 60
) {
  const basePrice = Math.max(0.01, Number(rawBasePrice) || 1250);
  const cleanSymbol = String(rawSymbol || 'RELIANCE').toUpperCase();
  const isCrypto =
    cleanSymbol.includes('USDT') ||
    cleanSymbol.includes('BTC') ||
    cleanSymbol.includes('ETH') ||
    cleanSymbol.includes('SOL') ||
    cleanSymbol.includes('BNB') ||
    cleanSymbol.includes('DOGE') ||
    cleanSymbol.includes('XRP');

  // Seeded deterministic PRNG for company-specific stable curves
  const rng = createSeededRandom(`${cleanSymbol}_${timeframe}`);

  // Step duration per candle based on timeframe
  let stepMs = 5 * 60 * 1000; // 5 min for 1D
  if (timeframe === '1W') stepMs = 3 * 60 * 60 * 1000; // 3 hours
  else if (timeframe === '1M') stepMs = 24 * 60 * 60 * 1000; // 1 day
  else if (timeframe === '1Y') stepMs = 7 * 24 * 60 * 60 * 1000; // 1 week
  else if (timeframe === 'ALL') stepMs = 30 * 24 * 60 * 60 * 1000; // 1 month

  const now = Date.now();
  // Volatility scale: Crypto ~0.35%, Stocks ~0.18% per candle
  const vol = (isCrypto ? 0.0032 : 0.0019) * basePrice;

  // Build natural multi-frequency harmonic price curve anchored backward from basePrice
  const rawCloses = [basePrice];
  let curr = basePrice;
  for (let i = 1; i < count; i++) {
    const wave = Math.sin(i / 6.2) * vol * 1.5 + Math.cos(i / 11.5) * vol * 0.8;
    const jitter = (rng() - 0.49) * vol * 1.1;
    curr = curr - (wave * 0.35 + jitter);
    rawCloses.unshift(Math.max(basePrice * 0.35, curr));
  }

  let periodHigh = Math.max(...rawCloses);
  let periodLow = Math.min(...rawCloses);
  const candles = [];

  for (let i = 0; i < count; i++) {
    const ts = now - (count - 1 - i) * stepMs;
    const d = new Date(ts);

    let timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    if (timeframe === '1W' || timeframe === '1M') {
      timeStr = `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })}`;
    } else if (timeframe === '1Y' || timeframe === 'ALL') {
      timeStr = `${d.toLocaleString('en-US', { month: 'short' })} '${String(d.getFullYear()).slice(-2)}`;
    }

    const c = rawCloses[i];
    const prevC = i > 0 ? rawCloses[i - 1] : c * (1 - (rng() - 0.5) * 0.002);
    const o = prevC;
    const wickHigh = Math.max(o, c) + rng() * (vol * 0.6);
    const wickLow = Math.max(basePrice * 0.3, Math.min(o, c) - rng() * (vol * 0.6));

    if (wickHigh > periodHigh) periodHigh = wickHigh;
    if (wickLow < periodLow) periodLow = wickLow;

    candles.push({
      timestamp: ts,
      time: timeStr,
      open: Number(o.toFixed(2)),
      high: Number(wickHigh.toFixed(2)),
      low: Number(wickLow.toFixed(2)),
      close: Number(c.toFixed(2)),
      volume: Math.floor(rng() * 65000 + 12000),
    });
  }

  // Ensure last candle close is guaranteed to match basePrice
  candles[candles.length - 1].close = Number(basePrice.toFixed(2));
  const currentPrice = candles[candles.length - 1].close;
  const previousClose = candles[0].open;
  const change = Number((currentPrice - previousClose).toFixed(2));
  const changePercent = previousClose ? Number(((change / previousClose) * 100).toFixed(2)) : 0;

  return {
    success: true,
    symbol: cleanSymbol,
    timeframe,
    currentPrice,
    previousClose,
    change,
    changePercent,
    isPositive: change >= 0,
    high: Number(periodHigh.toFixed(2)),
    low: Number(periodLow.toFixed(2)),
    open: Number(candles[0].open.toFixed(2)),
    volume: 1845000,
    currency: isCrypto ? 'USDT' : 'INR',
    source: 'synthetic',
    candles,
  };
}
