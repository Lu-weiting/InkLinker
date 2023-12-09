import React from 'react';
import Plot from 'react-plotly.js';

const TopProductsBarChart = ({ data }) => {
  // 初始化 trace 对象
  let traces = {};

  data.top.forEach(product => {
    if (!traces[product.size]) {
      traces[product.size] = {
        x: [],
        y: [],
        name: `Size ${product.size}`,
        type: 'bar'
      };
    }
    traces[product.size].x.push(`Product ${product.id}`);
    traces[product.size].y.push(product.total_qty);
  });

  const plotData = Object.values(traces);

  return (
    <Plot
      data={plotData}
      layout={{ 
        title: 'Top 5 Products Sales by Size',
        barmode: 'stack'
      }}
    />
  );
};

export default TopProductsBarChart;
