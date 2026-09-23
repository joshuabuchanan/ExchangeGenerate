const SYMBOLS = { USD: "$", EUR: "€", GBP: "£", JPY: "¥", CAD: "C$", AUD: "A$", CHF: "Fr", CNY: "¥", INR: "₹", JMD: "J$", MXN: "$", BRL: "R$", KRW: "₩", ZAR: "R" };

export default function CurrencySelect({ label, value, onChange, currencies }) {
  return (
    <label className="currency-field">
      <span>{label}</span>
      <div className="select-control">
        <b aria-hidden="true">{SYMBOLS[value] || value.slice(0, 1)}</b>
        <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
          {Object.entries(currencies).map(([code, name]) => <option key={code} value={code}>{code} — {name}</option>)}
        </select>
      </div>
    </label>
  );
}
