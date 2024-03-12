// ChartContainer.js
"use client";
import React, { useState } from "react";
import Chart from "./Chart";

function ChartContainer({ data }) {
  const [selectedColumn, setSelectedColumn] = useState("Open");
  const [chartType, setChartType] = useState("line");

  const handleColumnChange = (event) => {
    setSelectedColumn(event.target.value);
  };

  const handleChartTypeChange = () => {
    setChartType((prevType) => (prevType === "line" ? "bar" : "line"));
  };

  return (
    <div className="chart-container w-[50%]">
      <div className="flex flex-row justify-between">
        <div className="p-2">
          <label htmlFor="column">Select Column:</label>
          <select
            className="text-black border border-black"
            name="column"
            value={selectedColumn}
            onChange={handleColumnChange}
          >
            <option value="Open">Open</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
            <option value="Close">Close</option>
            <option value="Volume">Volume</option>
          </select>
        </div>
        <div
          onClick={handleChartTypeChange}
          className="m-2 border-white border rounded"
        >
          <button
            className={`p-2 rounded ${chartType === "bar" && "bg-yellow-400"}`}
          >
            Bar
          </button>
          <button
            className={`p-2 rounded ${chartType === "line" && "bg-yellow-400"}`}
          >
            Line
          </button>
        </div>
      </div>
      <Chart
        data={data}
        selectedColumn={selectedColumn}
        chartType={chartType}
      />
    </div>
  );
}

export default ChartContainer;
