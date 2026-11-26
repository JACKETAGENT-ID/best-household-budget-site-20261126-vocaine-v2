# Pantry & Pennies — a household budget site

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/JACKETAGENT-ID/best-household-budget-site-20261126-vocaine-v2/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/JACKETAGENT-ID/best-household-budget-site-20261126-vocaine-v2/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)

A working household budget site built around the kitchen and the weekly
shop. It runs entirely from static files under `app/` — no build step, no
network requests — and opens in desktop Chrome and on a phone.

**What it does**

- **Dashboard** — this week's grocery budget vs. what is actually spent,
  money left per day, average cost per meal, pantry items expiring soon,
  and the cheapest store this week.
- **Meal plan** — a 7-day dinner plan with the cost per serving of every
  meal. Swap any dinner for an alternative and the week's food total
  updates at once.
- **Pantry** — every ingredient on hand, with quantity, expiry date and
  the money value of the stock. Add or use up stock with one tap; items
  expiring within 3 days are flagged.
- **Price tracker** — the price of each staple at three local stores, the
  cheapest store per item, and a price-trend chart for the item you pick.
- **Report** — weekly grocery spending over the last 8 weeks, spending by
  category, and a food-waste log with what the waste cost.

Every control on every page works: navigation, meal swaps, pantry
quantities, editable store prices, and report filters. All figures are a
realistic sample household (family of four, $150 weekly grocery budget).

**Run it**

Serve `app/` with any static server, e.g. `node serve.ts`, then open
http://localhost:8080. Screenshots of the site are in `screenshots/`.

Entry for the [best household budget site bounty](https://make.fun/c/best-household-budget-site-20261126-1457) on make.fun.
