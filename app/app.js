// Pantry & Pennies — app shell.
//
// A tiny hash router: #/ dashboard, #/meals, #/pantry, #/prices,
// #/report. Rendering is one function per page (pages.js); this file
// only wires the route, the nav state, the charts and the clicks.

import { drawBarChart, drawLineChart } from './charts.js';
import {
  PRICE_TRACKER,
  WEEKLY_HISTORY,
  adjustPantry,
  restoreMeal,
  setPrice,
  swapMeal,
} from './state.js';
import {
  renderDashboard,
  renderMeals,
  renderPantry,
  renderPrices,
  renderReport,
} from './pages.js';

const view = document.getElementById('view');
const navLinks = [...document.querySelectorAll('.nav a')];

// Page-local UI state that is not worth persisting.
let selectedPriceItem = PRICE_TRACKER[0].id;
let reportWeeks = 8;

const ROUTES = {
  '': { render: renderDashboard, title: 'Dashboard' },
  meals: { render: renderMeals, title: 'Meal plan' },
  pantry: { render: renderPantry, title: 'Pantry' },
  prices: { render: () => renderPrices(selectedPriceItem), title: 'Price tracker' },
  report: { render: () => renderReport(reportWeeks), title: 'Report' },
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  return ROUTES[hash] ? hash : '';
}

function drawCharts(route) {
  if (route === 'prices') {
    const canvas = document.getElementById('trend-chart');
    if (canvas) {
      const tracked = PRICE_TRACKER.find((t) => t.id === selectedPriceItem) ?? PRICE_TRACKER[0];
      drawLineChart(canvas, tracked.history, ['22 Oct', '29 Oct', '5 Nov', '12 Nov', '19 Nov', '26 Nov']);
    }
  }
  if (route === 'report') {
    const canvas = document.getElementById('weekly-chart');
    if (canvas) {
      const weeks = WEEKLY_HISTORY.slice(-reportWeeks).map((w) => ({
        week: w.week.split(' ')[0],
        total: w.total,
        partial: w.week.includes('*'),
      }));
      drawBarChart(canvas, weeks);
    }
  }
}

function render() {
  const route = currentRoute();
  view.innerHTML = ROUTES[route].render();
  document.title = `${ROUTES[route].title} — Pantry & Pennies`;
  for (const link of navLinks) {
    const target = link.getAttribute('href').replace(/^#\/?/, '');
    if (target === route) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  drawCharts(route);
  window.scrollTo(0, 0);
}

view.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'swap-meal') {
    swapMeal(button.dataset.day, Number(button.dataset.alt));
    render();
  } else if (action === 'restore-meal') {
    restoreMeal(button.dataset.day);
    render();
  } else if (action === 'pantry-inc') {
    adjustPantry(button.dataset.id, 1);
    render();
  } else if (action === 'pantry-dec') {
    adjustPantry(button.dataset.id, -1);
    render();
  } else if (action === 'pick-item') {
    selectedPriceItem = button.dataset.id;
    render();
  } else if (action === 'report-weeks') {
    reportWeeks = Number(button.dataset.weeks);
    render();
  }
});

view.addEventListener('change', (event) => {
  const input = event.target.closest('[data-action="edit-price"]');
  if (!input) return;
  if (setPrice(input.dataset.id, input.dataset.store, input.value)) render();
  else render();
});

window.addEventListener('hashchange', render);
window.addEventListener('resize', () => drawCharts(currentRoute()));

render();
