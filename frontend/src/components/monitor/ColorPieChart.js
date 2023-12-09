import Plot from 'react-plotly.js';

const ColorPieChart = ({ data }) => {
  // 处理数据以用于饼图
  const colors = data.color_code;
  const quantities = data.total_count;

  return (
    <Plot
      data={[
        {
          values: quantities,
          labels: data.color_name,
          type: 'pie',
          marker: {
            colors: colors
          }
        }
      ]}
      layout={{ title: 'Product Colors Distribution' }}
    />
  );
};

export default ColorPieChart;
