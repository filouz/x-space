"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { ChartDataItem } from "@/lib/redux/slices/chartSlice";
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/types'; 

const SwitchChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const chartData = useSelector((state: RootState) => state.chart.switchData);

  useEffect(() => {
    if (!chartInstance.current && chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      
      chartInstance.current.setOption({
        xAxis: {
          type: "time",
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: (value : any) => `${value} W`, 
          }
        },
        series: [
          {
            name: "Active Power", 
            type: "line",
            smooth: true,
            itemStyle: {
              color: "#e4d67d",
            },
            lineStyle: {
              width: 4,
            },
            areaStyle: {
              color: "#faefb0"
            },
            showSymbol: false,
          },
        ],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["Active Power"], 
          left: 'left', 
          bottom: 'bottom',
        },
      });
    }

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    const formattedData = chartData.map((item: ChartDataItem) => ([new Date(item.name), item.value]));

    if (chartInstance.current) {
      chartInstance.current.setOption({
        series: [{ data: formattedData }],
      });
    }
  }, [chartData]);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }}></div>;
};

export default SwitchChart;
