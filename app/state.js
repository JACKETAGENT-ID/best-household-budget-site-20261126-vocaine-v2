// Pantry & Pennies — state.
//
// Holds the household's live numbers: the budget, the chosen meal for
// each day, pantry quantities and the store prices the user edits.
// Changes are kept in memory and saved to localStorage, so a refresh
// keeps the household's edits; everything still works with storage off.

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
} from './data.js';

const STORAGE_KEY = 'pantry-pennies-v1';
const TODAY = new Date('2026-11-26T12:00:00');

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
    return null;
  } catch {
    return null;
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      weeklyBudget: state.weeklyBudget,
      chosenMeals: state.chosenMeals,
      pantryQty: state.pantryQty,
      prices: state.prices,
    }));
  } catch {
    // Storage full or blocked: the site keeps working in memory.
  }
}

const saved = loadSaved();

export const state = {
  weeklyBudget: saved?.weeklyBudget ?? HOUSEHOLD.weeklyBudget,
  // day id -> index into that day's alternatives, or -1 for the planned meal
  chosenMeals: saved?.chosenMeals ?? Object.fromEntries(MEAL_PLAN.map((m) => [m.id, -1])),
  pantryQty: saved?.pantryQty ?? Object.fromEntries(PANTRY.map((p) => [p.id, p.qty])),
  prices: saved?.prices ?? Object.fromEntries(
    PRICE_TRACKER.map((t) => [t.id, { ...t.prices }]),
  ),
};

export function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

export function spentSoFar() {
  return DAILY_SPEND.reduce((sum, d) => sum + d.amount, 0);
}

export function daysLeft() {
  // Fri, Sat, Sun remain of this week.
  return 3;
}

export function remainingBudget() {
  return state.weeklyBudget - spentSoFar();
}

export function dailyAllowance() {
  return remainingBudget() / daysLeft();
}

export function mealCost(day) {
  const pick = state.chosenMeals[day.id] ?? -1;
  const dish = pick < 0 ? day : { ...day, ...day.alternatives[pick] };
  return dish.costPerServing * dish.servings;
}

export function mealPlanTotal() {
  return MEAL_PLAN.reduce((sum, day) => sum + mealCost(day), 0);
}

export function averageMealCost() {
  return mealPlanTotal() / (MEAL_PLAN.length * 4);
}

export function chosenDish(day) {
  const pick = state.chosenMeals[day.id] ?? -1;
  return pick < 0 ? day : { ...day, ...day.alternatives[pick] };
}

export function swapMeal(dayId, altIndex) {
  state.chosenMeals[dayId] = altIndex;
  save();
}

export function restoreMeal(dayId) {
  state.chosenMeals[dayId] = -1;
  save();
}

export function daysUntilExpiry(isoDate) {
  const expiry = new Date(`${isoDate}T00:00:00`);
  return Math.round((expiry - TODAY) / 86400000);
}

export function pantryValue() {
  return PANTRY.reduce((sum, p) => sum + (state.pantryQty[p.id] ?? 0) * p.unitPrice, 0);
}

export function expiringSoon() {
  return PANTRY.filter((p) => {
    const days = daysUntilExpiry(p.expires);
    return days >= 0 && days <= 3 && (state.pantryQty[p.id] ?? 0) > 0;
  });
}

export function adjustPantry(id, delta) {
  const item = PANTRY.find((p) => p.id === id);
  if (!item) return;
  const next = Math.max(0, (state.pantryQty[id] ?? 0) + delta);
  state.pantryQty[id] = Math.round(next * 100) / 100;
  save();
}

export function cheapestStore(itemId) {
  const prices = state.prices[itemId];
  let best = null;
  for (const [store, price] of Object.entries(prices)) {
    if (best === null || price < best.price) best = { store, price };
  }
  return best;
}

export function setPrice(itemId, store, value) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 999) return false;
  state.prices[itemId][store] = Math.round(parsed * 100) / 100;
  save();
  return true;
}

export function storeTotals() {
  return Object.keys(state.prices[PRICE_TRACKER[0].id]).map((store) => ({
    store,
    total: PRICE_TRACKER.reduce((sum, t) => sum + state.prices[t.id][store], 0),
  }));
}

export function cheapestStoreOverall() {
  const totals = storeTotals();
  return totals.reduce((best, t) => (t.total < best.total ? t : best), totals[0]);
}

export function wasteTotal() {
  return WASTE_LOG.reduce((sum, w) => sum + w.cost, 0);
}

export { CATEGORY_SPEND, DAILY_SPEND, HOUSEHOLD, MEAL_PLAN, PANTRY, PRICE_TRACKER, STORES, WASTE_LOG, WEEKLY_HISTORY };
