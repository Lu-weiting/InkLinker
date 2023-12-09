import React from 'react';
import Plot from 'react-plotly.js';

const PriceRangeHistogram = ({ data }) => {
  const xValues = data.price.map(item => 500 + item.price_range * 20);
  return (
    <Plot
      data={[
        {
          x: xValues,
          type: 'histogram',
          autobinx: false,
          xbins: {
            start: 500,
            end: 2000,
            size: 20
          }
        }
      ]}
      layout={{ title: 'Sales Quantity by Price Range', xaxis: { title: 'Price Range' }, yaxis: { title: 'Quantity' } }}
    />
  );
};

export default PriceRangeHistogram;
