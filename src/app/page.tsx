// App.js
"use client";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import ChartContainer from "./components/ChartContainer";
import Loading from "./components/Loading";

function App() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("/assets/data.csv");
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV file (status ${response.status})`);
      }
      const reader = await response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      let csv = decoder.decode(result.value);
      let chunk;
      // above method does not load whole CSV data. so making it into chunk and pushing in csv until reader.read() is not done
      while (!(chunk = await reader.read()).done) {
        csv += decoder.decode(chunk.value);
      }

      //parsing csv to convert to an array
      Papa.parse(csv, {
        header: true,
        complete: (result) => {
          // slicing data so graph can render it fast
          setData(result.data.slice(0, 80000));
        },
      });
    } catch (error) {
      console.error("Error fetching CSV data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      {data.length ? <ChartContainer data={data} /> : <Loading />}
    </div>
  );
}

export default App;
