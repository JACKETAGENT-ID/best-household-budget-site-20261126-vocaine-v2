// Pantry & Pennies — charts.
//
// Two small canvas charts, drawn with the 2D context and nothing else:
// a bar chart for weekly spending and a line chart for price trends.
// Both scale to the canvas size and to the device pixel ratio so they
// stay sharp on a phone.

const INK = '#33402f';
const MUTED = '#6d7568';
const GREEN = '#2e6b4f';
const TOMATO = '#c65a3a';
const GOLD = '#d9a441';

function setupCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, width: rect.width, height: rect.height };
}

function niceMax(value) {
  const step = value <= 50 ? 10 : value <= 100 ? 20 : 50;
  return Math.ceil(value / step) * step;
}

export function drawBarChart(canvas, entries) {
  const { ctx, width, height } = setupCanvas(canvas);
  const padLeft = 44;
  const padRight = 8;
  const padTop = 12;
  const padBottom = 30;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;
  const max = niceMax(Math.max(...entries.map((e) => e.total)));
  ctx.clearRect(0, 0, width, height);

  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let v = 0; v <= max; v += max / 4) {
    const y = padTop + plotHeight - (v / max) * plotHeight;
    ctx.fillText(`$${v}`, padLeft - 6, y);
    ctx.strokeStyle = '#e4ddcd';
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(width - padRight, y);
    ctx.stroke();
  }

  const gap = 8;
  const barWidth = (plotWidth - gap * (entries.length - 1)) / entries.length;
  entries.forEach((entry, i) => {
    const barHeight = (entry.total / max) * plotHeight;
    const x = padLeft + i * (barWidth + gap);
    const y = padTop + plotHeight - barHeight;
    ctx.fillStyle = entry.partial ? GOLD : GREEN;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`$${entry.total.toFixed(0)}`, x + barWidth / 2, y - 4);
    ctx.fillStyle = MUTED;
    ctx.textBaseline = 'top';
    ctx.fillText(entry.week, x + barWidth / 2, padTop + plotHeight + 6);
  });
}

export function drawLineChart(canvas, points, labels) {
  const { ctx, width, height } = setupCanvas(canvas);
  const padLeft = 40;
  const padRight = 12;
  const padTop = 14;
  const padBottom = 28;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const lo = Math.floor(min * 0.9 * 100) / 100;
  const hi = Math.ceil(max * 1.05 * 100) / 100;
  ctx.clearRect(0, 0, width, height);

  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let step = 0; step <= 4; step += 1) {
    const value = lo + ((hi - lo) * step) / 4;
    const y = padTop + plotHeight - ((value - lo) / (hi - lo)) * plotHeight;
    ctx.fillText(`$${value.toFixed(2)}`, padLeft - 6, y);
    ctx.strokeStyle = '#e4ddcd';
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(width - padRight, y);
    ctx.stroke();
  }

  const xAt = (i) => padLeft + (i / (points.length - 1)) * plotWidth;
  const yAt = (v) => padTop + plotHeight - ((v - lo) / (hi - lo)) * plotHeight;

  ctx.strokeStyle = TOMATO;
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((value, i) => {
    if (i === 0) ctx.moveTo(xAt(i), yAt(value));
    else ctx.lineTo(xAt(i), yAt(value));
  });
  ctx.stroke();
  ctx.lineWidth = 1;

  points.forEach((value, i) => {
    ctx.fillStyle = '#fff8ec';
    ctx.strokeStyle = TOMATO;
    ctx.beginPath();
    ctx.arc(xAt(i), yAt(value), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`$${value.toFixed(2)}`, xAt(i), yAt(value) - 8);
    ctx.fillStyle = MUTED;
    ctx.textBaseline = 'top';
    ctx.fillText(labels[i], xAt(i), padTop + plotHeight + 6);
  });
}
