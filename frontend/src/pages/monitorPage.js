import React, { useState, useEffect } from 'react';
import TotalRevenue from '../components/monitor/TotalRevenue';
import ColorPieChart from '../components/monitor/ColorPieChart';
import PriceRangeHistogram from '../components/monitor/PriceRangeHistogram';
import SizeProductsBarChart from '../components/monitor/SizeProductsBarChart';
import { GetOrderList } from '../hooks/api';
import styled from 'styled-components';
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* 兩列 */
  grid-template-rows: 1fr 1fr; /* 兩行 */
  grid-gap: 10px; /* 格子間距 */
  height: 100vh; /* 設定高度為視窗的高度 */
  width: 100vw; /* 設定寬度為視窗的寬度 */
  padding: 10px; /* 添加一些內邊距 */
`;
const MonitorPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await GetOrderList();
      setData(fetchedData);
    };

    loadData();
  }, []);

  return (
    <GridContainer>
      <TotalRevenue data={data} />
      <ColorPieChart data={data} />
      <PriceRangeHistogram data={data} />
      <SizeProductsBarChart data={data} />
    </GridContainer>
  );
};

export default MonitorPage;
