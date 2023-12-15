"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { ChartDataItem } from "@/lib/redux/slices/chartSlice";
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/types'; 

const ActivityChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const chartData = useSelector((state: RootState) => state.chart.activityData);

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
            formatter: (value : any) => `${value} h`, 
          }
        },
        series: [
          {
            name: "Activity", 
            type: "line",
            smooth: true,
            itemStyle: {
              color: "#329af3",
            },
            lineStyle: {
              width: 4,
            },
            areaStyle: {
              color: "#52b0f6"
            },
            showSymbol: false,
          },
        ],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["Activity"], 
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

export default ActivityChart;
