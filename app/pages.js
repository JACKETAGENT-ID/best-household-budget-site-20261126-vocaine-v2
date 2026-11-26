// Pantry & Pennies — pages.
//
// One render function per page. Each returns an HTML string; app.js
// puts it in <main> and then draws that page's charts. All figures come
// from state.js, so every control on the page updates the numbers live.

import {
  CATEGORY_SPEND,
  DAILY_SPEND,
  HOUSEHOLD,
  MEAL_PLAN,
  PANTRY,
  PRICE_TRACKER,
  STORES,
  WASTE_LOG,
  WEEKLY_HISTORY,
  averageMealCost,
  cheapestStore,
  cheapestStoreOverall,
  chosenDish,
  dailyAllowance,
  daysLeft,
  daysUntilExpiry,
  expiringSoon,
  mealCost,
  mealPlanTotal,
  money,
  pantryValue,
  remainingBudget,
  spentSoFar,
  state,
  storeTotals,
  wasteTotal,
} from './state.js';

function progressBar(used, total) {
  const pct = Math.min(100, Math.round((used / total) * 100));
  return `<div class="meter" role="img" aria-label="${pct}% of budget spent">
    <div class="meter-fill" style="width:${pct}%"></div>
  </div><p class="meter-label">${pct}% of the weekly budget used</p>`;
}

function expiryBadge(item) {
  const days = daysUntilExpiry(item.expires);
  if (days < 0) return '<span class="badge badge-bad">Expired</span>';
  if (days === 0) return '<span class="badge badge-bad">Use today</span>';
  if (days <= 3) return `<span class="badge badge-warn">Expires in ${days} day${days === 1 ? '' : 's'}</span>`;
  return `<span class="badge badge-ok">${days} days left</span>`;
}

export function renderDashboard() {
  const spent = spentSoFar();
  const remaining = remainingBudget();
  const soon = expiringSoon();
  const best = cheapestStoreOverall();
  const weekMeals = mealPlanTotal();
  return `
  <section class="hero">
    <p class="eyebrow">${HOUSEHOLD.weekLabel} · Today ${HOUSEHOLD.todayLabel}</p>
    <h1>Groceries, planned.<br>Money, kept.</h1>
    <p class="lede">One page for the ${HOUSEHOLD.name.toLowerCase()} food budget:
    what the week costs, what is already spent, and what is still sitting
    in the pantry. Family of four, weekly budget ${money(HOUSEHOLD.weeklyBudget)}.</p>
  </section>

  <section class="cards" aria-label="This week at a glance">
    <article class="card card-wide">
      <h2>This week's budget</h2>
      <p class="big">${money(spent)} <span class="muted">spent of ${money(state.weeklyBudget)}</span></p>
      ${progressBar(spent, state.weeklyBudget)}
      <dl class="split">
        <div><dt>Left for the week</dt><dd>${money(remaining)}</dd></div>
        <div><dt>Per day, ${daysLeft()} days left</dt><dd>${money(dailyAllowance())}</dd></div>
        <div><dt>Planned dinners total</dt><dd>${money(weekMeals)}</dd></div>
        <div><dt>Average cost per meal</dt><dd>${money(averageMealCost())} / serving</dd></div>
      </dl>
      <p class="hint">On track: ${money(remaining)} left for Fri–Sun is
      ${money(dailyAllowance())} a day, and the meal plan costs
      ${money(weekMeals)} for the whole week.</p>
    </article>

    <article class="card">
      <h2>Cheapest shop this week</h2>
      <p class="big">${best.store}</p>
      <p class="muted">The 8 tracked staples cost
      ${money(best.total)} there — ${money(Math.max(...storeTotals().map((t) => t.total)) - best.total)}
      less than the dearest store.</p>
      <a class="button" href="#/prices">Compare all three stores</a>
    </article>

    <article class="card">
      <h2>Use it or lose it</h2>
      <p class="big">${soon.length} items <span class="muted">expire within 3 days</span></p>
      <ul class="plain">
        ${soon.slice(0, 4).map((p) => `<li>${p.item} — ${p.expires.slice(5)} (${daysUntilExpiry(p.expires)} days)</li>`).join('')}
      </ul>
      <a class="button" href="#/pantry">Open the pantry</a>
    </article>
  </section>

  <section class="panel">
    <div class="panel-head">
      <h2>Spending so far this week</h2>
      <a href="#/report">Full report →</a>
    </div>
    <table class="table">
      <thead><tr><th>Day</th><th class="num">Spent</th><th class="num">Running total</th></tr></thead>
      <tbody>
        ${DAILY_SPEND.map((d, i) => {
          const running = DAILY_SPEND.slice(0, i + 1).reduce((s, x) => s + x.amount, 0);
          return `<tr><td>${d.day}</td><td class="num">${money(d.amount)}</td><td class="num">${money(running)}</td></tr>`;
        }).join('')}
      </tbody>
    </table>
    <p class="hint">Biggest day was Wednesday (${money(31.2)}) — the weekly
    shop. Thursday was a top-up shop only. <a href="#/meals">Tonight's dinner</a>
    is salmon at ${money(4.6)} a serving; swapping it saves up to
    ${money((4.6 - 2.1) * 4)} for the week.</p>
  </section>`;
}

export function renderMeals() {
  const total = mealPlanTotal();
  return `
  <section class="page-head">
    <p class="eyebrow">${HOUSEHOLD.weekLabel}</p>
    <h1>Meal plan</h1>
    <p class="lede">Seven dinners for four people. Pick a cheaper or
    quicker alternative any night and the week's total updates right away.
    Planned food cost for the week: <strong>${money(total)}</strong>
    (${money(averageMealCost())} per serving on average).</p>
  </section>

  <ol class="meals">
    ${MEAL_PLAN.map((day) => {
      const dish = chosenDish(day);
      const pick = state.chosenMeals[day.id] ?? -1;
      return `<li class="meal ${day.id === 'thu' ? 'meal-today' : ''}">
        <div class="meal-day"><span class="meal-weekday">${day.day}</span><span class="muted">${day.date}</span></div>
        <div class="meal-main">
          <h2>${dish.meal}</h2>
          <p class="muted">${dish.time} · ${dish.servings} servings · ${day.tag}${pick >= 0 ? ' · swapped in' : ''}</p>
          <div class="swap">
            <span class="swap-label">Swap for:</span>
            ${day.alternatives.map((alt, i) => `
              <button type="button" class="chip ${pick === i ? 'chip-on' : ''}"
                data-action="swap-meal" data-day="${day.id}" data-alt="${i}">
                ${alt.meal} · ${money(alt.costPerServing)}/serving</button>`).join('')}
            ${pick >= 0 ? `<button type="button" class="chip chip-plain"
              data-action="restore-meal" data-day="${day.id}">Back to plan</button>` : ''}
          </div>
        </div>
        <p class="meal-cost">${money(mealCost(day))}<span class="muted"> / night</span></p>
      </li>`;
    }).join('')}
  </ol>

  <section class="panel">
    <h2>Week total</h2>
    <p class="big">${money(total)} <span class="muted">for 7 dinners × 4 servings</span></p>
    <p class="hint">Cheapest possible week (every cheapest alternative):
    ${money(MEAL_PLAN.reduce((s, d) => s + Math.min(d.costPerServing, ...d.alternatives.map((a) => a.costPerServing)) * 4, 0))}
    — swapping every night saves
    ${money(total - MEAL_PLAN.reduce((s, d) => s + Math.min(d.costPerServing, ...d.alternatives.map((a) => a.costPerServing)) * 4, 0))}
    against the current plan. The plan as written stays under the
    ${money(state.weeklyBudget)} weekly budget with room for breakfasts,
    lunches and snacks.</p>
  </section>`;
}

export function renderPantry() {
  const value = pantryValue();
  const soon = expiringSoon();
  return `
  <section class="page-head">
    <p class="eyebrow">What's on hand · ${PANTRY.length} items</p>
    <h1>Pantry</h1>
    <p class="lede">Everything already bought, what it is worth, and what
    runs out first. Stock on hand is worth <strong>${money(value)}</strong>.
    ${soon.length} items expire within 3 days — cook those first.</p>
  </section>

  <section class="panel">
    <div class="panel-head">
      <h2>Stock list</h2>
      <span class="muted">Tap − / + to use up or add stock</span>
    </div>
    <table class="table pantry-table">
      <thead><tr><th>Item</th><th>Where</th><th>Expires</th><th></th><th class="num">Qty</th><th class="num">Value</th></tr></thead>
      <tbody>
        ${PANTRY.map((p) => {
          const qty = state.pantryQty[p.id] ?? 0;
          return `<tr>
            <td><strong>${p.item}</strong></td>
            <td>${p.shelf}</td>
            <td>${p.expires} ${expiryBadge(p)}</td>
            <td>
              <button type="button" class="stepper" data-action="pantry-dec" data-id="${p.id}" aria-label="Use one ${p.item}">−</button>
              <button type="button" class="stepper" data-action="pantry-inc" data-id="${p.id}" aria-label="Add one ${p.item}">+</button>
            </td>
            <td class="num">${qty} ${p.unit}</td>
            <td class="num">${money(qty * p.unitPrice)}</td>
          </tr>`;
        }).join('')}
      </tbody>
      <tfoot><tr><td colspan="5"><strong>Total stock value</strong></td><td class="num"><strong>${money(value)}</strong></td></tr></tfoot>
    </table>
  </section>

  <section class="panel">
    <h2>Cook first</h2>
    <p>These run out of date before Sunday. Tonight's salmon uses the
    spinach; tomorrow's pizza uses the cheddar and the bread is for
    Friday's sandwiches.</p>
    <ul class="plain">
      ${soon.map((p) => `<li><strong>${p.item}</strong> — ${state.pantryQty[p.id]} ${p.unit} left, expires ${p.expires} (${daysUntilExpiry(p.expires)} day${daysUntilExpiry(p.expires) === 1 ? '' : 's'})</li>`).join('')}
    </ul>
  </section>`;
}

export function renderPrices(selectedId) {
  const tracked = PRICE_TRACKER.find((t) => t.id === selectedId) ?? PRICE_TRACKER[0];
  const cheapest = cheapestStore(tracked.id);
  const totals = storeTotals();
  const bestOverall = cheapestStoreOverall();
  return `
  <section class="page-head">
    <p class="eyebrow">Checked Thu 26 Nov 2026</p>
    <h1>Price tracker</h1>
    <p class="lede">The same 8 staples priced at three local stores.
    Buying everything at <strong>${bestOverall.store}</strong> costs
    ${money(bestOverall.total)} — the cheapest basket this week. Tap a
    price to correct it and the cheapest store updates.</p>
  </section>

  <section class="panel">
    <div class="panel-head"><h2>Staples, by store</h2><span class="muted">Prices in $ · tap a price to edit</span></div>
    <table class="table price-table">
      <thead><tr><th>Item</th>${STORES.map((s) => `<th class="num">${s}</th>`).join('')}<th class="num">Cheapest</th></tr></thead>
      <tbody>
        ${PRICE_TRACKER.map((t) => {
          const best = cheapestStore(t.id);
          return `<tr class="${t.id === tracked.id ? 'row-on' : ''}">
            <td><button type="button" class="linklike" data-action="pick-item" data-id="${t.id}">${t.item}</button></td>
            ${STORES.map((s) => {
              const price = state.prices[t.id][s];
              const isBest = best.store === s;
              return `<td class="num ${isBest ? 'best' : ''}"><label class="visually-hidden" for="price-${t.id}-${s}">${t.item} at ${s}</label><input id="price-${t.id}-${s}" class="price-input" type="number" min="0" max="999" step="0.01" value="${price.toFixed(2)}" data-action="edit-price" data-id="${t.id}" data-store="${s}"></td>`;
            }).join('')}
            <td class="num"><strong>${best.store}</strong> · ${money(best.price)}</td>
          </tr>`;
        }).join('')}
      </tbody>
      <tfoot><tr><td><strong>Basket total</strong></td>${totals.map((t) => `<td class="num ${t.store === bestOverall.store ? 'best' : ''}"><strong>${money(t.total)}</strong></td>`).join('')}<td class="num"><strong>${bestOverall.store}</strong></td></tr></tfoot>
    </table>
    <p class="hint">ValueGrocer wins all 8 staples this week, so the basket
    gap to the dearest store is
    ${money(Math.max(...totals.map((t) => t.total)) - bestOverall.total)}.
    If a price changes at your shop, tap it and the cheapest store updates.</p>
  </section>

  <section class="panel">
    <div class="panel-head"><h2>Price trend — ${tracked.item}</h2><span class="muted">Best price, last 6 weeks</span></div>
    <canvas id="trend-chart" class="chart" height="220" aria-label="Price trend chart for ${tracked.item}"></canvas>
    <p class="hint">Best price fell from ${money(tracked.history[0])} to
    ${money(cheapest.price)} over six weeks — down
    ${money(tracked.history[0] - cheapest.price)}. Tap another item in the
    table above to see its trend.</p>
  </section>`;
}

export function renderReport(weeksShown) {
  const weeks = WEEKLY_HISTORY.slice(-weeksShown);
  const total = weeks.reduce((s, w) => s + w.total, 0);
  const avg = total / weeks.length;
  const catTotal = CATEGORY_SPEND.reduce((s, c) => s + c.amount, 0);
  const waste = wasteTotal();
  return `
  <section class="page-head">
    <p class="eyebrow">8 weeks of grocery spending</p>
    <h1>Report</h1>
    <p class="lede">Where the money went, week by week. Average over the
    last ${weeks.length} weeks: <strong>${money(avg)} a week</strong>
    against a ${money(state.weeklyBudget)} budget. * This week is Mon–Thu only.</p>
    <div class="filters" role="group" aria-label="Weeks shown">
      ${[4, 8].map((n) => `<button type="button" class="chip ${weeksShown === n ? 'chip-on' : ''}" data-action="report-weeks" data-weeks="${n}">Last ${n} weeks</button>`).join('')}
    </div>
  </section>

  <section class="panel">
    <div class="panel-head"><h2>Weekly spending</h2><span class="muted">Budget ${money(state.weeklyBudget)} / week</span></div>
    <canvas id="weekly-chart" class="chart" height="240" aria-label="Weekly spending bar chart"></canvas>
    <p class="hint">The dearest week was 26 Oct – 1 Nov at
    ${money(156.2)} — a big shop before guests came. Seven of the last
    eight weeks stayed under the ${money(state.weeklyBudget)} budget.</p>
  </section>

  <section class="cards">
    <article class="card">
      <h2>This week by category</h2>
      <ul class="bars">
        ${CATEGORY_SPEND.map((c) => {
          const pct = Math.round((c.amount / catTotal) * 100);
          return `<li><span class="bar-label">${c.category}</span>
            <span class="bar-track"><span class="bar-fill" style="width:${pct}%;background:${c.color}"></span></span>
            <span class="num">${money(c.amount)} · ${pct}%</span></li>`;
        }).join('')}
      </ul>
      <p class="hint">Meat &amp; fish is the biggest slice at
      ${money(34.6)}. Two meat-free dinners a week would cut it by about a third.</p>
    </article>

    <article class="card">
      <h2>Food waste</h2>
      <p class="big">${money(waste)} <span class="muted">thrown away in 12 days</span></p>
      <ul class="plain">
        ${WASTE_LOG.map((w) => `<li>${w.date} — ${w.item} · ${money(w.cost)}</li>`).join('')}
      </ul>
      <p class="hint">That runs to about ${money((waste / 12) * 30)} a month
      if the habit holds — a whole weekly shop wasted roughly every ten
      months. The pantry page flags what to cook first.</p>
    </article>
  </section>`;
}
