import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import ConverterForm from "./components/ConverterForm";
import PolicyPage from "./components/PolicyPage";

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("eg-theme") || "dark");
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || "home");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("eg-theme", theme);
  }, [theme]);

  useEffect(() => {
    const updateRoute = () => setRoute(window.location.hash.slice(1) || "home");
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  const isPolicyPage = ["privacy", "terms", "legal"].includes(route);

  return (
    <>
      <Analytics />
      <div className="app-shell">
        <header className="topbar">
          <a className="brand" href="#home" aria-label="ExchangeGenerate home">
          <img className="brand-mark" src="./EG%20logo.svg" alt="ExchangeGenerate logo" />
          <span className="brand-wordmark">Exchange<span>Generate</span></span>
        </a>
        <div className="header-actions">
          <span className="live-status"><i /> Rates online</span>
          <button className="icon-button" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
          </button>
        </div>
      </header>
      {isPolicyPage ? <PolicyPage type={route} /> : <main id="home">
          <section className="intro" aria-labelledby="page-title">
            <div className="intro-copy-block">
              <div className="intro-brand-mark">
                <img src="./EG%20logo.svg" alt="ExchangeGenerate logo" />
              </div>
              <p className="eyebrow">LIVE CURRENCY INTELLIGENCE</p>
              <h1 id="page-title">Move money with<br /><em>better context.</em></h1>
            </div>
            <p className="intro-copy">Convert global currencies, follow recent movement, and keep the pairs that matter to you in one focused workspace.</p>
          </section>
          <ConverterForm />
        </main>}
        <footer><span>ExchangeGenerate</span><nav className="legal-nav" aria-label="Legal"><a href="#privacy">Privacy</a><a href="#terms">Terms</a><a href="#legal">Legal</a></nav></footer>
      </div>
    </>
  );
}

export default App;
