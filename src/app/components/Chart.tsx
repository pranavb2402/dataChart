// Chart.js
import React, { useEffect, useMemo, useRef } from "react";
import ReactECharts from "echarts-for-react";

function Chart({ data, selectedColumn, chartType }) {
  const chartRef = useRef(null);
  const dataRef = useRef({});

  const { xAxisData } = useMemo(() => {
    const xAxisData = data.map((row) => row.Date);
    return {
      xAxisData,
    };
  }, [data]);

  const { seriesData } = useMemo(() => {
    const seriesData = dataRef.current[selectedColumn]
      ? dataRef.current[selectedColumn]
      : (dataRef.current[selectedColumn] = data.map(
          (row) => row[selectedColumn]
        ));
    return {
      seriesData,
    };
  }, [data, selectedColumn]);

  const { averageSeriesData, monthlyAverages } = useMemo(getAverageSeriesData, [
    data,
    selectedColumn,
  ]);

  function getAverageSeriesData() {
    const monthlyAverages = {};
    data.forEach((row) => {
      const date = new Date(row.Date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (!monthlyAverages[monthYear]) {
        monthlyAverages[monthYear] = { sum: 0, count: 0 };
      }
      monthlyAverages[monthYear].sum += parseFloat(row[selectedColumn]);
      monthlyAverages[monthYear].count++;
    });

    const averageSeriesData = Object.keys(monthlyAverages).map((key) => {
      return {
        name: key,
        value: monthlyAverages[key].sum / monthlyAverages[key].count,
      };
    });

    return { averageSeriesData, monthlyAverages };
  }

  useEffect(() => {
    if (chartRef.current && data.length) {
      const chartInstance = chartRef.current.getEchartsInstance();
      if (chartType === "line") {
        chartInstance.setOption({
          xAxis: { data: xAxisData },
          yAxis: {},
          series: [
            {
              type: "line",
              data: seriesData,
            },
          ],
        });
      } else if (chartType === "bar") {
        chartInstance.setOption({
          xAxis: { type: "category", data: Object.keys(monthlyAverages) },
          yAxis: {},
          series: [
            {
              type: "bar",
              data: averageSeriesData,
            },
          ],
        });
      }
    }
  }, [data, selectedColumn, chartType]);

  console.log("rendered");

  return (
    <ReactECharts option={{}} ref={chartRef} style={{ height: "400px" }} />
  );
}

export default Chart;
