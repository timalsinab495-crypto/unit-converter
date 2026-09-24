# Naptaul (नापतौल)

A unit converter for the way Nepal measures: ropani, aana, bigha, kattha, dharni, pau, tola, mana, kos, plus rupee
rates for the dollar, Indian rupee, gold, silver and petrol.

It's built to teach three Vercel ideas:

1. **Serverless functions.** Every conversion runs on the server in `src/app/api/convert/[slug]/route.ts`.
2. **Environment variables.** Rates that change over time are read from `process.env`, never hard-coded.
3. **Logs.** Page visits, conversions, warnings and crashes are all logged and show up in the Vercel Logs tab.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Log lines print in the same terminal.

## Deploy to Vercel

1. Push this folder to a GitHub repo and import it on vercel.com.
2. In **Settings → Environment Variables**, add the variables from `.env.example`.
3. Redeploy. Environment variable changes only apply to new deployments.

`.env` is in `.gitignore`, so it never reaches Vercel. If you skip step 2 the site still works: it uses
built-in fallback values, shows "(fallback)" on the rate board, and writes a 🔑 `env_fallback` warning to the logs.

## Environment variables

| Variable | Meaning |
| --- | --- |
| `USD_TO_NPR` | 1 US dollar in Nepali rupees |
| `INR_TO_NPR` | 1 Indian rupee in Nepali rupees |
| `GOLD_PRICE_PER_TOLA_NPR` | Price of 1 tola of gold |
| `SILVER_PRICE_PER_TOLA_NPR` | Price of 1 tola of silver |
| `PETROL_PRICE_PER_LITRE_NPR` | Price of 1 litre of petrol |
| `RATES_UPDATED_ON` | Date shown on the home page rate board |

The values in `.env.example` are samples for class, not live rates.

## What gets logged

Each line starts with an emoji and an event name, then a readable message, then JSON you can search.

| Event | Level | When |
| --- | --- | --- |
| 🧊 `cold_start` | info | A new server instance boots (first request after a deploy or idle period) |
| 👀 `page_view` | info | Someone opens a page: IP, city and country, browser, OS, device, referrer |
| 🔁 `convert_request` | info | The Convert button was pressed |
| ✅ `convert_success` | info | The result, how long it took, and which rate was used |
| ✋ `invalid_input` | warning | Input wasn't a number, was negative, or too large |
| ❓ `unknown_conversion` | warning | Someone asked for a conversion that doesn't exist |
| 🔑 `env_fallback` | warning | An environment variable is missing or not a number |
| 💥 `convert_crash` | error | A conversion threw an error (includes the stack trace) |
| 🔥 `unhandled_error` | error | Any other uncaught server error |

Every conversion gets a short **request ID**. The converter page shows it under "Behind the scenes", and you can
paste it into the Logs search box to find that exact request.

## Where things live

```
src/
  app/
    page.tsx                      Home page
    convert/[slug]/page.tsx       A converter page (server)
    convert/[slug]/converter.tsx  The form, swap button and results (browser)
    convert/[slug]/error.tsx      Shown when a conversion crashes
    api/convert/[slug]/route.ts   The API route that does the conversion
  lib/
    conversions/catalog.ts        Names, examples and fun facts for each conversion
    conversions/formulas/*.ts     The maths, one file per category
    rates.ts                      Reads rates from environment variables
    logger.ts                     The log helper
    visitor.ts                    Reads IP, location and browser from request headers
  instrumentation.ts              Cold start logging and uncaught error logging
```
