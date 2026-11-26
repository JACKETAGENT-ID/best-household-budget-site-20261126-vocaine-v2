// Pantry & Pennies — sample household data.
//
// One realistic household: the Alvarez family, two adults and two kids,
// weekly grocery budget $150. Week shown: Mon 23 – Sun 29 Nov 2026;
// "today" is Thu 26 Nov, so Mon–Thu spending is in and Fri–Sun is left.
// Every number on the site comes from here; nothing is a placeholder.

export const HOUSEHOLD = {
  name: 'The Alvarez household',
  people: 4,
  weekLabel: 'Week of 23 – 29 Nov 2026',
  todayLabel: 'Thu 26 Nov 2026',
  weeklyBudget: 150,
  monthlyBudget: 600,
};

// Money actually spent so far this week, by day.
export const DAILY_SPEND = [
  { day: 'Mon 23 Nov', amount: 28.4 },
  { day: 'Tue 24 Nov', amount: 24.15 },
  { day: 'Wed 25 Nov', amount: 31.2 },
  { day: 'Thu 26 Nov', amount: 12.65 },
];

// Spending so far this week, by category. Sums to $96.40.
export const CATEGORY_SPEND = [
  { category: 'Meat & fish', amount: 34.6, color: '#c65a3a' },
  { category: 'Produce', amount: 28.15, color: '#4d7c5f' },
  { category: 'Dairy & eggs', amount: 14.2, color: '#d9a441' },
  { category: 'Pantry & dry goods', amount: 12.45, color: '#7a6a8f' },
  { category: 'Frozen', amount: 7.0, color: '#5b8a9e' },
];

// The 7-day dinner plan. Each dinner has two cheaper-or-different
// alternatives the household can swap in; swapping updates the total.
export const MEAL_PLAN = [
  {
    id: 'mon', day: 'Monday', date: '23 Nov', meal: 'Lemon herb chicken, rice & green beans',
    costPerServing: 3.1, servings: 4, time: '35 min', tag: 'Family favourite',
    alternatives: [
      { meal: 'Tomato basil pasta with parmesan', costPerServing: 2.35, time: '25 min' },
      { meal: 'Bean & cheese quesadillas', costPerServing: 1.95, time: '20 min' },
    ],
  },
  {
    id: 'tue', day: 'Tuesday', date: '24 Nov', meal: 'Beef & broccoli stir-fry',
    costPerServing: 3.85, servings: 4, time: '30 min', tag: 'Quick',
    alternatives: [
      { meal: 'Chicken fried rice', costPerServing: 2.9, time: '25 min' },
      { meal: 'Veggie noodle stir-fry', costPerServing: 2.2, time: '20 min' },
    ],
  },
  {
    id: 'wed', day: 'Wednesday', date: '25 Nov', meal: 'Spaghetti Bolognese',
    costPerServing: 2.95, servings: 4, time: '40 min', tag: 'Batch-friendly',
    alternatives: [
      { meal: 'Lentil soup with crusty bread', costPerServing: 1.8, time: '35 min' },
      { meal: 'Tuna pasta bake', costPerServing: 2.6, time: '30 min' },
    ],
  },
  {
    id: 'thu', day: 'Thursday', date: '26 Nov', meal: 'Pan-fried salmon, potatoes & salad',
    costPerServing: 4.6, servings: 4, time: '30 min', tag: 'Tonight',
    alternatives: [
      { meal: 'Baked chicken thighs with carrots', costPerServing: 3.05, time: '45 min' },
      { meal: 'Egg fried rice with peas', costPerServing: 2.1, time: '20 min' },
    ],
  },
  {
    id: 'fri', day: 'Friday', date: '27 Nov', meal: 'Homemade pizza night',
    costPerServing: 2.7, servings: 4, time: '30 min', tag: 'Kids cook',
    alternatives: [
      { meal: 'Flatbread wraps with salad', costPerServing: 2.45, time: '15 min' },
      { meal: 'Mac & cheese with broccoli', costPerServing: 2.15, time: '25 min' },
    ],
  },
  {
    id: 'sat', day: 'Saturday', date: '28 Nov', meal: 'Slow-cooker beef stew',
    costPerServing: 3.4, servings: 4, time: '15 min + 4 hrs', tag: 'Slow cooker',
    alternatives: [
      { meal: 'Chili con carne with rice', costPerServing: 2.75, time: '40 min' },
      { meal: 'Roast chicken with potatoes', costPerServing: 3.2, time: '1 hr 10 min' },
    ],
  },
  {
    id: 'sun', day: 'Sunday', date: '29 Nov', meal: 'Roast chicken, carrots & mash',
    costPerServing: 3.55, servings: 4, time: '1 hr 15 min', tag: 'Sunday roast',
    alternatives: [
      { meal: "Shepherd's pie", costPerServing: 2.85, time: '50 min' },
      { meal: 'Veggie curry with rice', costPerServing: 2.4, time: '35 min' },
    ],
  },
];

// What is actually in the pantry right now. Expiry dates are real dates
// in this week and the weeks after; value = qty x unit price.
export const PANTRY = [
  { id: 'milk', item: 'Milk 1 L', qty: 2, unit: 'cartons', unitPrice: 1.15, expires: '2026-11-28', shelf: 'Fridge' },
  { id: 'eggs', item: 'Eggs, dozen', qty: 1, unit: 'dozen', unitPrice: 2.6, expires: '2026-12-05', shelf: 'Fridge' },
  { id: 'chicken', item: 'Chicken breast', qty: 1.2, unit: 'kg', unitPrice: 8.4, expires: '2026-11-27', shelf: 'Fridge' },
  { id: 'beef', item: 'Ground beef', qty: 0.8, unit: 'kg', unitPrice: 9.8, expires: '2026-11-27', shelf: 'Fridge' },
  { id: 'rice', item: 'Long-grain rice', qty: 5, unit: 'kg', unitPrice: 1.3, expires: '2027-03-12', shelf: 'Cupboard' },
  { id: 'pasta', item: 'Pasta 500 g', qty: 3, unit: 'packs', unitPrice: 1.1, expires: '2027-06-10', shelf: 'Cupboard' },
  { id: 'tomatoes', item: 'Canned tomatoes', qty: 4, unit: 'cans', unitPrice: 0.95, expires: '2027-08-01', shelf: 'Cupboard' },
  { id: 'onions', item: 'Onions', qty: 1, unit: 'kg', unitPrice: 1.3, expires: '2026-12-08', shelf: 'Cupboard' },
  { id: 'potatoes', item: 'Potatoes', qty: 2, unit: 'kg', unitPrice: 1.2, expires: '2026-12-10', shelf: 'Cupboard' },
  { id: 'cheddar', item: 'Cheddar 400 g', qty: 1, unit: 'block', unitPrice: 4.2, expires: '2026-12-02', shelf: 'Fridge' },
  { id: 'butter', item: 'Butter 250 g', qty: 1, unit: 'block', unitPrice: 3.1, expires: '2026-12-20', shelf: 'Fridge' },
  { id: 'spinach', item: 'Spinach 300 g', qty: 1, unit: 'bag', unitPrice: 1.8, expires: '2026-11-27', shelf: 'Fridge' },
  { id: 'bread', item: 'Wholemeal loaf', qty: 1, unit: 'loaf', unitPrice: 2.2, expires: '2026-11-27', shelf: 'Bread bin' },
  { id: 'bananas', item: 'Bananas', qty: 6, unit: 'fruit', unitPrice: 0.18, expires: '2026-11-28', shelf: 'Fruit bowl' },
];

export const STORES = ['FreshMart', 'ValueGrocer', 'Corner Market'];

// Shelf price of each staple at each of the three stores, plus the best
// (cheapest) price of that item over the last 6 weeks for the trend chart.
export const PRICE_TRACKER = [
  { id: 'milk', item: 'Milk 1 L', prices: { FreshMart: 1.19, ValueGrocer: 1.09, 'Corner Market': 1.29 }, history: [1.29, 1.25, 1.19, 1.19, 1.15, 1.09] },
  { id: 'eggs', item: 'Eggs, dozen', prices: { FreshMart: 2.79, ValueGrocer: 2.59, 'Corner Market': 2.89 }, history: [2.99, 2.89, 2.79, 2.79, 2.69, 2.59] },
  { id: 'chicken', item: 'Chicken breast / kg', prices: { FreshMart: 8.99, ValueGrocer: 8.49, 'Corner Market': 9.49 }, history: [9.29, 9.19, 8.99, 8.79, 8.69, 8.49] },
  { id: 'beef', item: 'Ground beef / kg', prices: { FreshMart: 10.49, ValueGrocer: 9.79, 'Corner Market': 10.99 }, history: [10.99, 10.79, 10.49, 10.29, 9.99, 9.79] },
  { id: 'rice', item: 'Rice 5 kg bag', prices: { FreshMart: 6.99, ValueGrocer: 6.49, 'Corner Market': 7.29 }, history: [7.49, 7.29, 6.99, 6.99, 6.79, 6.49] },
  { id: 'pasta', item: 'Pasta 500 g', prices: { FreshMart: 1.29, ValueGrocer: 1.09, 'Corner Market': 1.39 }, history: [1.39, 1.35, 1.29, 1.19, 1.15, 1.09] },
  { id: 'tomatoes', item: 'Canned tomatoes', prices: { FreshMart: 1.05, ValueGrocer: 0.89, 'Corner Market': 1.15 }, history: [1.15, 1.09, 1.05, 0.99, 0.95, 0.89] },
  { id: 'cheddar', item: 'Cheddar 400 g', prices: { FreshMart: 4.59, ValueGrocer: 4.19, 'Corner Market': 4.79 }, history: [4.79, 4.69, 4.59, 4.49, 4.29, 4.19] },
];

// Weekly grocery spending, oldest first. The last week is this week so
// far (Mon–Thu), marked partial.
export const WEEKLY_HISTORY = [
  { week: '5 – 11 Oct', total: 132.4 },
  { week: '12 – 18 Oct', total: 148.9 },
  { week: '19 – 25 Oct', total: 121.75 },
  { week: '26 Oct – 1 Nov', total: 156.2 },
  { week: '2 – 8 Nov', total: 139.85 },
  { week: '9 – 15 Nov', total: 144.1 },
  { week: '16 – 22 Nov', total: 128.6 },
  { week: '23 – 29 Nov *', total: 96.4 },
];

// Food that was thrown away, and what it cost. * = week in progress.
export const WASTE_LOG = [
  { date: '24 Nov', item: 'Lettuce, wilted in the fridge', cost: 1.6 },
  { date: '22 Nov', item: 'Half a loaf of bread, gone stale', cost: 1.1 },
  { date: '20 Nov', item: 'Leftover rice, forgotten', cost: 0.85 },
  { date: '18 Nov', item: 'Yogurt, past its date', cost: 1.25 },
  { date: '15 Nov', item: 'Bananas, overripe', cost: 0.7 },
];
