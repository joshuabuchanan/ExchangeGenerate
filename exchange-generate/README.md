# ExchangeGenerate

ExchangeGenerate is a focused currency conversion workspace built with React and Vite. It combines live exchange rates with recent movement, saved currency pairs, conversion history, and practical context for everyday currency comparisons.

## Features

- Convert between supported currencies using live Frankfurter exchange-rate data
- View recent rate movement with a responsive 30-day trend chart
- Save frequently used currency pairs for quick access
- Review conversion history stored locally in the browser
- Continue using cached rate data when the network is unavailable
- Switch between light and dark themes
- Browse privacy, terms, and legal information pages
- Track anonymous page views with Vercel Web Analytics

Exchange rates are for reference only and are not financial advice or a trading service.

## Tech stack

- React 18
- Vite
- JavaScript and CSS
- Frankfurter API
- Vercel Web Analytics
- Browser `localStorage`

## Project structure

The repository contains the application in the `exchange-generate` directory:

```text
exchange-generate/
	src/
	public/
	package.json
	vite.config.js
```

Run all commands from that directory.

## Run locally

```bash
cd exchange-generate
npm install
npm run dev
```

Vite will print the local URL, usually `http://localhost:5173`.

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Deploy with Vercel

1. Push the repository to GitHub.
2. Import the repository at [vercel.com](https://vercel.com/).
3. Set **Root Directory** to `exchange-generate`.
4. Use these build settings:
	 - Framework preset: **Vite**
	 - Install command: `npm install`
	 - Build command: `npm run build`
	 - Output directory: `dist`
5. Deploy the project. Vercel will build the app and redeploy it when the selected branch changes.

Vercel Web Analytics is included through `@vercel/analytics`. Enable Web Analytics for the Vercel project to view traffic data.

## Contributing

1. Create a branch for your change.
2. Run `npm run lint` and `npm run build` from `exchange-generate`.
3. Open a pull request with a short description of the change.

## License

No license has been specified yet. Contact the repository owner before reusing this project in another product.
