const POLICIES = {
  privacy: {
    label: "Privacy",
    title: "Privacy policy",
    meta: "Effective date: September 21, 2026. ExchangeGenerate is a browser-based currency conversion and exchange-rate dashboard. Privacy contact: the ExchangeGenerate project operator.",
    sections: [
      {
        title: "Conversion data",
        body: "ExchangeGenerate does not ask you to upload files or create an account. The amount, source currency, target currency, and conversion results you enter are handled in your browser. ExchangeGenerate sends currency-pair and amount requests to its configured rate provider when you request a live conversion, so that provider may receive the request and ordinary network metadata."
      },
      {
        title: "Browser storage",
        body: "The app stores recent conversion history, saved currency pairs, cached exchange rates, and your light or dark theme preference in your browser's localStorage. These values are not an ExchangeGenerate account or a server database. Use the Clear control in Conversion history or clear this site's browser storage to remove locally saved records."
      },
      {
        title: "Third-party resources",
        body: "Live rates use the Frankfurter API by default. A deployment may be configured to use the XE API instead. Those providers process requests under their own privacy policies and may receive request details such as the selected currencies, amount, IP address, timestamps, and service logs. The app can also use saved rate data when a live request is unavailable."
      },
      {
        title: "Cookies and analytics",
        body: "ExchangeGenerate does not include advertising cookies, analytics, behavioral profiling, or an account system by default. The app uses localStorage rather than cookies to remember theme, history, favorites, and cached rate data. Hosting or API providers may maintain their own technical logs."
      },
      {
        title: "Rights and requests",
        body: "Contact the ExchangeGenerate project operator with privacy questions or deletion requests. Because saved activity is stored in your browser, you can delete it directly by clearing conversion history or this site's localStorage. The operator should update this policy if a deployment adds accounts, analytics, cookies, additional providers, or different data-retention practices."
      }
    ]
  },
  terms: {
    label: "Terms",
    title: "Terms of use",
    meta: "These terms describe use of ExchangeGenerate, a currency conversion and exchange-rate reference tool operated by the ExchangeGenerate project operator. Contact: the project operator.",
    sections: [
      {
        title: "Service",
        body: "ExchangeGenerate provides currency conversions, exchange-rate snapshots, recent movement charts, saved currency pairs, and conversion history on an as-available basis. Rates can be delayed, unavailable, incomplete, or different from rates offered by a bank, card network, broker, or money-transfer provider."
      },
      {
        title: "Acceptable use",
        body: "Use ExchangeGenerate lawfully and do not interfere with the app, its hosting, or its rate providers. Do not abuse automated requests, bypass access controls, introduce malicious code, or use the service to misrepresent a financial rate or transaction. You are responsible for complying with laws and provider terms that apply to your use."
      },
      {
        title: "Rates and results",
        body: "ExchangeGenerate is a reference calculator, not a bank, broker, money-transfer service, or financial adviser. You are responsible for checking the rate date, decimal result, fees, spreads, and applicable taxes before acting on a conversion. Keep your own records for any financial decision or transaction."
      },
      {
        title: "Disclaimer and liability",
        body: "The service is provided \"as is\" to the extent permitted by law. The operator does not guarantee uninterrupted availability, accurate or current rates, error-free calculations, or access to historical data. ExchangeGenerate is not financial, tax, accounting, or investment advice. To the extent permitted by law, the operator is not liable for losses caused by reliance on a displayed rate, conversion result, chart, or saved browser data."
      },
      {
        title: "Changes",
        body: "These terms may be updated when ExchangeGenerate or its rate sources change. The effective date shown with the published terms should be updated whenever material terms change. Continued use of the app after an update means you accept the revised terms to the extent permitted by law."
      }
    ]
  },
  legal: {
    label: "Legal",
    title: "Legal and ownership",
    meta: "ExchangeGenerate is operated by the ExchangeGenerate project operator. Legal contact: the project operator.",
    sections: [
      {
        title: "Copyright and permitted reuse",
        body: "The original ExchangeGenerate source code, layout, visual design, workflows, and technical setup may be copied, modified, adapted, recreated, imitated, and redistributed under the ExchangeGenerate Permissive Software and Design License in the repository's LICENSE file. Any reuse must use a different name and must remove ExchangeGenerate branding. Third-party packages, APIs, logos, fonts, images, exchange-rate data, and sample content remain subject to their own licenses and ownership rights."
      },
      {
        title: "Brand and naming",
        body: "ExchangeGenerate, the ExchangeGenerate name, and the ExchangeGenerate logo are reserved project branding. Permission to reuse the software or imitate its design does not include permission to use that name, logo, or branding, or to imply sponsorship, approval, affiliation, or official status. A reused or modified version must be presented under another name and with its own branding. This notice does not claim that a trademark is registered."
      },
      {
        title: "Copyright concerns",
        body: "For a copyright or trademark concern about the ExchangeGenerate interface or branding, contact the project operator with the affected material, your ownership basis, and a way to reach you. The operator will review valid notices and may remove or correct material when appropriate. Concerns about exchange-rate data or API services should also be directed to the relevant provider."
      },
      {
        title: "Third-party software",
        body: "React, Vite, JavaScript packages, and rate services used by ExchangeGenerate are distributed or provided under their respective licenses and terms. Review package metadata, API terms, and deployment dependencies before redistributing a hosted or modified version."
      }
    ]
  }
};

export default function PolicyPage({ type }) {
  const policy = POLICIES[type] || POLICIES.privacy;

  return (
    <main className="policy-main" id="top">
      <div className="policy-layout">
        <aside className="policy-index" aria-label="Legal pages">
          <p className="section-kicker">DOCUMENTS</p>
          <nav>
            {Object.entries(POLICIES).map(([key, item]) => <a className={key === type ? "active" : ""} href={`#${key}`} key={key}>{item.label}<span>↗</span></a>)}
          </nav>
        </aside>
        <article className="policy-document">
          <div className="policy-heading">
            <p className="eyebrow">CONVERTSTATION / {policy.label.toUpperCase()}</p>
            <h1>{policy.title}</h1>
            <p className="policy-meta">{policy.meta}</p>
          </div>
          <div className="policy-sections">
            {policy.sections.map((section, index) => <section className="policy-section" key={section.title}><span className="policy-number">0{index + 1}</span><div><h2>{section.title}</h2><p>{section.body}</p></div></section>)}
          </div>
        </article>
      </div>
    </main>
  );
}
