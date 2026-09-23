import { useCallback, useEffect, useMemo, useState } from "react";
import CurrencySelect from "./CurrencySelect";

const API = "https://api.frankfurter.dev/v2";
const XE_API = "https://xecdapi.xe.com/v1";
const XE_ACCESS_ID = import.meta.env.VITE_XE_ACCESS_ID;
const XE_ACCESS_KEY = import.meta.env.VITE_XE_ACCESS_KEY;
const useXeApi = Boolean(XE_ACCESS_ID && XE_ACCESS_KEY);
const CURRENCY_OPTIONS = {
  USD: "United States Dollar",
  EUR: "Euro",
  GBP: "British Pound Sterling",
  JPY: "Japanese Yen",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  INR: "Indian Rupee",
  SEK: "Swedish Krona",
  NOK: "Norwegian Krone",
  DKK: "Danish Krone",
  PLN: "Polish Złoty",
  CZK: "Czech Koruna",
  HUF: "Hungarian Forint",
  TRY: "Turkish Lira",
  ZAR: "South African Rand",
  MXN: "Mexican Peso",
  BRL: "Brazilian Real",
  SGD: "Singapore Dollar",
  HKD: "Hong Kong Dollar",
  NZD: "New Zealand Dollar",
  IDR: "Indonesian Rupiah",
  MYR: "Malaysian Ringgit",
  PHP: "Philippine Peso",
  THB: "Thai Baht",
  KRW: "South Korean Won",
  AED: "United Arab Emirates Dirham",
  SAR: "Saudi Riyal",
  EGP: "Egyptian Pound",
  MAD: "Moroccan Dirham",
  NGN: "Nigerian Naira",
  KES: "Kenyan Shilling",
  UGX: "Ugandan Shilling",
  BDT: "Bangladeshi Taka",
  PKR: "Pakistani Rupee",
  LKR: "Sri Lankan Rupee",
  VND: "Vietnamese Đồng",
  RUB: "Russian Ruble",
  ILS: "Israeli New Shekel",
  BGN: "Bulgarian Lev",
  RON: "Romanian Leu",
  HRK: "Croatian Kuna",
  ARS: "Argentine Peso",
  CLP: "Chilean Peso",
  COP: "Colombian Peso",
  PEN: "Peruvian Sol",
  UYU: "Uruguayan Peso",
  BHD: "Bahraini Dinar",
  JMD: "Jamaican Dollar"
};
const OFFLINE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 148.5,
  AUD: 1.52,
  CAD: 1.36,
  CHF: 0.88,
  CNY: 7.18,
  INR: 83.7,
  SEK: 10.2,
  NOK: 10.6,
  DKK: 6.85,
  PLN: 3.91,
  CZK: 22.7,
  HUF: 373,
  TRY: 32.1,
  ZAR: 18.1,
  MXN: 18.5,
  BRL: 5.64,
  SGD: 1.35,
  HKD: 7.81,
  NZD: 1.61,
  IDR: 16300,
  MYR: 4.59,
  PHP: 58.2,
  THB: 35.5,
  KRW: 1370,
  AED: 3.67,
  SAR: 3.75,
  EGP: 49.8,
  MAD: 9.9,
  NGN: 1540,
  KES: 129,
  UGX: 3800,
  BDT: 108.5,
  PKR: 278,
  LKR: 297,
  VND: 25050,
  RUB: 89,
  ILS: 3.62,
  BGN: 1.8,
  RON: 4.65,
  HRK: 7.08,
  ARS: 1020,
  CLP: 940,
  COP: 3980,
  PEN: 3.7,
  UYU: 39.1,
  BHD: 0.38,
  JMD: 157
};
const money = (value, currency) => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: currency === "JPY" ? 0 : 2 }).format(value);

function normalizeCurrencies(payload) {
  if (payload && payload.symbols && typeof payload.symbols === "object") {
    return Object.entries(payload.symbols).reduce((result, [code, info]) => {
      result[code] = typeof info === "string" ? info : info.description || code;
      return result;
    }, {});
  }
  if (payload && Array.isArray(payload.currencies)) {
    return payload.currencies.reduce((result, currency) => {
      if (currency.iso_code) result[currency.iso_code] = currency.currency_name || currency.iso_code;
      return result;
    }, {});
  }
  if (Array.isArray(payload)) {
    return payload.reduce((result, currency) => {
      if (currency.iso_code) result[currency.iso_code] = currency.name || currency.iso_code;
      return result;
    }, {});
  }
  return CURRENCY_OPTIONS;
}

function xeHeaders() {
  return { Authorization: `Basic ${btoa(`${XE_ACCESS_ID}:${XE_ACCESS_KEY}`)}` };
}

function getCacheRateMap() {
  try {
    const cached = JSON.parse(localStorage.getItem("eg-rate-cache") || "null");
    return cached && typeof cached === "object" ? cached : OFFLINE_RATES;
  } catch {
    return OFFLINE_RATES;
  }
}

function getOfflineRate(from, to) {
  const rates = getCacheRateMap();
  const fromRate = rates[from] ?? OFFLINE_RATES[from];
  const toRate = rates[to] ?? OFFLINE_RATES[to];
  if (!fromRate || !toRate || fromRate === toRate) return 1;
  return toRate / fromRate;
}

function getOfflineTrend(from, to) {
  const rate = getOfflineRate(from, to);
  const start = new Date();
  start.setDate(start.getDate() - 35);
  const points = [];
  for (let index = 0; index <= 35; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const wave = Math.sin(index / 5.3) * 0.08;
    const drift = (index / 35) * 0.04;
    const value = rate * (1 + wave - drift);
    points.push({ date: date.toISOString().slice(0, 10), value });
  }
  return points;
}

function MiniChart({ points, positive }) {
  if (points.length < 2) return <div className="chart-empty">Trend data will appear after conversion.</div>;
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const coords = points.map((point, index) => `${4 + (index / (points.length - 1)) * 92},${72 - ((point.value - min) / range) * 60}`).join(" ");
  return <svg className={`trend-chart ${positive ? "positive" : "negative"}`} viewBox="0 0 100 80" preserveAspectRatio="none" role="img" aria-label="Thirty-day exchange rate trend"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".26" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs><polygon points={`4,76 ${coords} 96,76`} fill="url(#chartFill)" /><polyline points={coords} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg>;
}

export default function ConverterForm() {
  const [amount, setAmount] = useState("1000");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [currencies, setCurrencies] = useState(CURRENCY_OPTIONS);
  const [conversion, setConversion] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("eg-favorites") || "[]"));
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("eg-history") || "[]"));

  useEffect(() => {
    const syncConnectivity = () => setIsOffline(!navigator.onLine);
    window.addEventListener("online", syncConnectivity);
    window.addEventListener("offline", syncConnectivity);
    return () => {
      window.removeEventListener("online", syncConnectivity);
      window.removeEventListener("offline", syncConnectivity);
    };
  }, []);

  useEffect(() => {
    const currenciesRequest = useXeApi
      ? fetch(`${XE_API}/currencies.json`, { headers: xeHeaders() })
      : fetch(`${API}/currencies`);
    currenciesRequest
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload) => setCurrencies(normalizeCurrencies(payload)))
      .catch(() => setCurrencies(CURRENCY_OPTIONS));
  }, []);

  const convert = useCallback(async (recordHistory = true) => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) { setError("Enter an amount greater than zero."); return; }
    if (from === to) {
      const same = { amount: numericAmount, result: numericAmount, rate: 1, date: new Date().toISOString().slice(0, 10), from, to };
      setConversion(same);
      setTrend([]);
      setError("");
      return;
    }
    setLoading(true); setError("");
    try {
      if (!navigator.onLine) throw new Error("offline");
      const latestResponse = useXeApi
        ? await fetch(`${XE_API}/convert_from.json/?from=${from}&to=${to}&amount=${numericAmount}`, { headers: xeHeaders() })
        : await fetch(`${API}/rates?base=${from}`);
      if (!latestResponse.ok) throw new Error();
      const latest = await latestResponse.json();
      const previousRateMap = getCacheRateMap();
      const xeRate = latest.to?.find((quote) => quote.quotecurrency === to)?.mid;
      const frankfurterRate = Array.isArray(latest) ? latest.find((quote) => quote.quote === to)?.rate : 0;
      const rateValue = Number(useXeApi ? xeRate : frankfurterRate ?? 0);
      if (!rateValue) throw new Error();
      const refreshedRates = { ...previousRateMap, [from]: 1, [to]: rateValue };
      localStorage.setItem("eg-rate-cache", JSON.stringify(refreshedRates));
      const next = { amount: numericAmount, result: numericAmount * rateValue, rate: rateValue, date: latest.timestamp?.slice(0, 10) || latest.date || new Date().toISOString().slice(0, 10), from, to };
      setConversion(next);
      if (recordHistory) setHistory((current) => [next, ...current.filter((item) => !(item.from === from && item.to === to))].slice(0, 5));
      const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 35);
      const historicalResponse = await fetch(`${API}/rates?base=${from}&from=${start.toISOString().slice(0, 10)}&to=${end.toISOString().slice(0, 10)}`);
      if (historicalResponse.ok) {
        const historical = await historicalResponse.json();
        const points = historical.filter((quote) => quote.quote === to).map((quote) => ({ date: quote.date, value: Number(quote.rate) }));
        if (points.length) setTrend(points);
      }
    } catch {
      const offlineRate = getOfflineRate(from, to);
      const offlineTotal = numericAmount * offlineRate;
      const fallbackResult = { amount: numericAmount, result: offlineTotal, rate: offlineRate, date: new Date().toISOString().slice(0, 10), from, to };
      setConversion(fallbackResult);
      setTrend(getOfflineTrend(from, to));
      if (recordHistory) setHistory((current) => [fallbackResult, ...current.filter((item) => !(item.from === from && item.to === to))].slice(0, 5));
      setError("Offline mode: using saved exchange data.");
    } finally { setLoading(false); }
  }, [amount, from, to]);

  useEffect(() => { convert(false); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => localStorage.setItem("eg-history", JSON.stringify(history)), [history]);
  useEffect(() => localStorage.setItem("eg-favorites", JSON.stringify(favorites)), [favorites]);
  const movement = useMemo(() => trend.length < 2 ? 0 : ((trend.at(-1).value - trend[0].value) / trend[0].value) * 100, [trend]);
  const pairKey = `${from}-${to}`;
  const isFavorite = favorites.some((item) => item.key === pairKey);
  const toggleFavorite = () => setFavorites((current) => isFavorite ? current.filter((item) => item.key !== pairKey) : [...current, { key: pairKey, from, to }].slice(-4));
  const swap = () => { setFrom(to); setTo(from); };

  return (
    <div className="dashboard-grid">
      <section className="converter-card panel">
        <div className="panel-heading"><div><p className="section-kicker">CONVERTER</p><h2>Exchange calculator</h2></div><button className={`favorite-button ${isFavorite ? "active" : ""}`} type="button" onClick={toggleFavorite} aria-label={isFavorite ? "Remove saved pair" : "Save currency pair"}>☆</button></div>
        <form onSubmit={(event) => { event.preventDefault(); convert(); }}>
          <label className="amount-field"><span>Amount</span><input type="number" min="0.01" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" /></label>
          <div className="pair-row"><CurrencySelect label="From" value={from} onChange={setFrom} currencies={currencies} /><button className="swap-button" type="button" onClick={swap} aria-label="Swap currencies">⇄</button><CurrencySelect label="To" value={to} onChange={setTo} currencies={currencies} /></div>
          <button className="convert-button" type="submit" disabled={loading}>{loading ? "Checking live rate…" : "Convert currency"}<span>→</span></button>
        </form>
        <p className="network-status" aria-live="polite">{isOffline ? "Offline mode active" : "Live rates connected"}</p>
        {error && !conversion && <p className="error-message" role="alert">{error}</p>}
        {conversion && <div className="result-block" aria-live="polite"><p>{money(conversion.amount, conversion.from)} equals</p><strong>{money(conversion.result, conversion.to)}</strong><div><span>1 {conversion.from} = {conversion.rate.toFixed(4)} {conversion.to}</span><span>Rate date {conversion.date}</span></div></div>}
        {error && conversion && <p className="error-message" role="alert">{error}</p>}
      </section>
      <aside className="side-column">
        <section className="trend-card panel"><div className="panel-heading compact"><div><p className="section-kicker">30-DAY MOVEMENT</p><h2>{from} / {to}</h2></div><span className={`movement ${movement >= 0 ? "up" : "down"}`}>{movement >= 0 ? "+" : ""}{movement.toFixed(2)}%</span></div><MiniChart points={trend} positive={movement >= 0} /><div className="chart-axis"><span>{trend[0]?.date || "30 days ago"}</span><span>{trend.at(-1)?.date || "Today"}</span></div></section>
        <section className="saved-card panel"><div className="panel-heading compact"><div><p className="section-kicker">WATCHLIST</p><h2>Saved pairs</h2></div><span>{favorites.length}/4</span></div>{favorites.length ? <div className="saved-list">{favorites.map((item) => <button key={item.key} type="button" onClick={() => { setFrom(item.from); setTo(item.to); }}><b>{item.from} → {item.to}</b><span>Open pair</span></button>)}</div> : <p className="empty-copy">Select the star to save a currency pair here.</p>}</section>
      </aside>
      <section className="history-card panel"><div className="panel-heading compact"><div><p className="section-kicker">RECENT ACTIVITY</p><h2>Conversion history</h2></div>{history.length > 0 && <button className="text-button" onClick={() => setHistory([])} type="button">Clear</button>}</div>{history.length ? <div className="history-list">{history.map((item, index) => <button type="button" key={`${item.date}-${item.from}-${item.to}-${index}`} onClick={() => { setAmount(String(item.amount)); setFrom(item.from); setTo(item.to); }}><span className="history-pair">{item.from}<i>→</i>{item.to}</span><span>{money(item.amount, item.from)}</span><strong>{money(item.result, item.to)}</strong><time>{item.date}</time></button>)}</div> : <p className="empty-copy">Your latest conversions will appear here.</p>}</section>
    </div>
  );
}
