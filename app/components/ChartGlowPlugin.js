// ChartGlowPlugin.js
// Chart.js plugin to add a glow effect to line charts
export const ChartGlowPlugin = {
  id: 'glow',
  afterDatasetsDraw(chart, args, options) {
    const ctx = chart.ctx;
    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      if (!meta.hidden && meta.type === 'line') {
        ctx.save();
        ctx.shadowColor = options.color || '#38bdf8';
        ctx.shadowBlur = options.blur || 16;
        ctx.globalAlpha = 0.6;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        meta.data.forEach((point, idx) => {
          if (idx === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.strokeStyle = dataset.borderColor || '#38bdf8';
        ctx.lineWidth = dataset.borderWidth || 3;
        ctx.stroke();
        ctx.restore();
      }
    });
  }
};
