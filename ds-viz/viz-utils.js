var DSA = window.DSA || {};

(function() {
  'use strict';

  /**
   * Shared visualization drawing primitives.
   * Used by all topic viz modules to avoid code duplication.
   */

  /* ── CSS variable reader ────────────────────────────────── */
  function cssVar(name, fallback) {
    var val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return val || fallback || '';
  }

  function fontSans() { return cssVar('--font-sans', 'sans-serif'); }
  function fontMono() { return cssVar('--font-mono', 'monospace'); }

  /* ── Rounded rectangle path ─────────────────────────────── */
  function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /* ── Single cell with value ─────────────────────────────── */
  function drawCell(ctx, x, y, w, h, value, fillColor, textColor, opts) {
    opts = opts || {};
    var r = opts.radius || 4;
    var fontSize = opts.fontSize || Math.min(18, Math.max(12, w * 0.3));
    var font = opts.font || ('bold ' + fontSize + 'px ' + fontSans());

    ctx.fillStyle = fillColor;
    drawRoundedRect(ctx, x, y, w, h, r);
    ctx.fill();

    if (opts.borderColor) {
      ctx.strokeStyle = opts.borderColor;
      ctx.lineWidth = opts.borderWidth || 1;
      ctx.stroke();
    }

    ctx.fillStyle = textColor;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(value), x + w / 2, y + h / 2);
  }

  /* ── Index label below a cell ───────────────────────────── */
  function drawIndex(ctx, x, cellW, y, index) {
    ctx.fillStyle = cssVar('--text-tertiary', '#94a3b8');
    ctx.font = '12px ' + fontMono();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(String(index), x + cellW / 2, y + 6);
  }

  /* ── Pointer arrow (downward or upward) ─────────────────── */
  function drawArrow(ctx, x, y, direction, color, opts) {
    opts = opts || {};
    var len = opts.length || 18;
    var headSize = opts.headSize || 6;
    color = color || cssVar('--viz-active', '#ef4444');
    direction = direction || 'down';

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = opts.lineWidth || 2;

    if (direction === 'down') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + len);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y + len);
      ctx.lineTo(x - headSize, y + len - headSize);
      ctx.lineTo(x + headSize, y + len - headSize);
      ctx.closePath();
      ctx.fill();
    } else if (direction === 'up') {
      ctx.beginPath();
      ctx.moveTo(x, y + len);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - headSize, y + headSize);
      ctx.lineTo(x + headSize, y + headSize);
      ctx.closePath();
      ctx.fill();
    }
  }

  /* ── Pointer with label ─────────────────────────────────── */
  function drawPointerLabel(ctx, x, y, label, color, direction) {
    direction = direction || 'up';
    color = color || cssVar('--viz-active', '#ef4444');
    var arrowLen = 18;
    var fontSize = 12;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;

    if (direction === 'up') {
      // Arrow pointing up from below
      ctx.beginPath();
      ctx.moveTo(x, y + arrowLen);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 5, y + 8);
      ctx.lineTo(x + 5, y + 8);
      ctx.closePath();
      ctx.fill();
      // Label below arrow
      ctx.font = 'bold ' + fontSize + 'px ' + fontSans();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(label, x, y + arrowLen + 4);
    } else {
      // Arrow pointing down from above
      ctx.beginPath();
      ctx.moveTo(x, y - arrowLen);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 5, y - 8);
      ctx.lineTo(x + 5, y - 8);
      ctx.closePath();
      ctx.fill();
      // Label above arrow
      ctx.font = 'bold ' + fontSize + 'px ' + fontSans();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(label, x, y - arrowLen - 4);
    }
  }

  /* ── Bar chart renderer ─────────────────────────────────── */
  function drawBarChart(ctx, arr, w, h, opts) {
    opts = opts || {};
    var padding = opts.padding || 40;
    var colorFn = opts.colorFn || function() { return cssVar('--viz-default', '#3b82f6'); };
    var textColor = opts.textColor || cssVar('--text-primary', '#1e293b');
    var n = arr.length;

    var maxVal = 0;
    for (var i = 0; i < n; i++) {
      if (arr[i] > maxVal) maxVal = arr[i];
    }
    if (maxVal === 0) maxVal = 1;

    var barAreaWidth = w - padding * 2;
    var barAreaHeight = h - padding * 2 - 20;
    var gap = Math.max(4, barAreaWidth * 0.03);
    var barWidth = (barAreaWidth - gap * (n - 1)) / n;

    for (var j = 0; j < n; j++) {
      var barHeight = (arr[j] / maxVal) * barAreaHeight;
      var x = padding + j * (barWidth + gap);
      var y = h - padding - barHeight;
      var color = colorFn(j);

      // Bar with rounded top
      var radius = Math.min(barWidth / 4, 6);
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.lineTo(x, h - padding);
      ctx.lineTo(x + barWidth, h - padding);
      ctx.lineTo(x + barWidth, y + radius);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth - radius, y);
      ctx.lineTo(x + radius, y);
      ctx.quadraticCurveTo(x, y, x, y + radius);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fill();

      // Value label above
      ctx.fillStyle = textColor;
      ctx.font = 'bold 13px ' + fontSans();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(String(arr[j]), x + barWidth / 2, y - 4);

      // Index label below
      ctx.fillStyle = cssVar('--text-tertiary', '#94a3b8');
      ctx.font = '11px ' + fontSans();
      ctx.textBaseline = 'top';
      ctx.fillText(String(j), x + barWidth / 2, h - padding + 4);
    }

    return { barWidth: barWidth, gap: gap, padding: padding };
  }

  /* ── Center-compute array of cells ──────────────────────── */
  function centerArray(count, cellW, gap, canvasW) {
    var totalW = count * cellW + (count - 1) * gap;
    var startX = Math.max(10, (canvasW - totalW) / 2);
    return startX;
  }

  /* ── Parse comma-separated integer input ────────────────── */
  function parseIntArray(str) {
    if (!str || !str.trim()) return [];
    return str.split(',').map(function(s) {
      return parseInt(s.trim(), 10);
    }).filter(function(n) {
      return !isNaN(n);
    });
  }

  /* ── Random array generator ─────────────────────────────── */
  function randomArray(minLen, maxLen, minVal, maxVal) {
    minLen = minLen || 8;
    maxLen = maxLen || 12;
    minVal = minVal || 5;
    maxVal = maxVal || 100;
    var len = minLen + Math.floor(Math.random() * (maxLen - minLen + 1));
    var arr = [];
    for (var i = 0; i < len; i++) {
      arr.push(minVal + Math.floor(Math.random() * (maxVal - minVal + 1)));
    }
    return arr;
  }

  /* ── Draw tree node (circle) ────────────────────────────── */
  function drawTreeNode(ctx, x, y, radius, value, fillColor, textColor, opts) {
    opts = opts || {};
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    ctx.fill();
    if (opts.borderColor) {
      ctx.strokeStyle = opts.borderColor;
      ctx.lineWidth = opts.borderWidth || 2;
      ctx.stroke();
    }
    ctx.fillStyle = textColor;
    ctx.font = (opts.bold !== false ? 'bold ' : '') + (opts.fontSize || 14) + 'px ' + fontSans();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(value), x, y);
  }

  /* ── Draw tree edge (line between nodes) ────────────────── */
  function drawTreeEdge(ctx, x1, y1, x2, y2, color, lineWidth) {
    ctx.strokeStyle = color || cssVar('--viz-arrow', '#64748b');
    ctx.lineWidth = lineWidth || 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  /* ── Draw graph node (circle with label) ────────────────── */
  function drawGraphNode(ctx, x, y, radius, label, fillColor, textColor, borderColor) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    ctx.fill();
    if (borderColor) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.fillStyle = textColor;
    ctx.font = 'bold 14px ' + fontSans();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(label), x, y);
  }

  /* ── Draw curved arrow between two points ───────────────── */
  function drawCurvedArrow(ctx, sx, sy, ex, ey, color, opts) {
    opts = opts || {};
    ctx.strokeStyle = color || cssVar('--viz-arrow', '#64748b');
    ctx.fillStyle = color || cssVar('--viz-arrow', '#64748b');
    ctx.lineWidth = opts.lineWidth || 2;

    var cpx1 = sx + (ex - sx) * 0.4;
    var cpy1 = sy - (opts.curve || 20);
    var cpx2 = sx + (ex - sx) * 0.6;
    var cpy2 = ey - (opts.curve || 20);

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, ex, ey);
    ctx.stroke();

    // Arrowhead
    var angle = Math.atan2(ey - cpy2, ex - cpx2);
    var headLen = opts.headLen || 10;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - headLen * Math.cos(angle - 0.4), ey - headLen * Math.sin(angle - 0.4));
    ctx.lineTo(ex - headLen * Math.cos(angle + 0.4), ey - headLen * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fill();
  }

  /* ── Expose API ─────────────────────────────────────────── */
  DSA.vizUtils = {
    cssVar: cssVar,
    fontSans: fontSans,
    fontMono: fontMono,
    drawRoundedRect: drawRoundedRect,
    drawCell: drawCell,
    drawIndex: drawIndex,
    drawArrow: drawArrow,
    drawPointerLabel: drawPointerLabel,
    drawBarChart: drawBarChart,
    centerArray: centerArray,
    parseIntArray: parseIntArray,
    randomArray: randomArray,
    drawTreeNode: drawTreeNode,
    drawTreeEdge: drawTreeEdge,
    drawGraphNode: drawGraphNode,
    drawCurvedArrow: drawCurvedArrow
  };
})();
