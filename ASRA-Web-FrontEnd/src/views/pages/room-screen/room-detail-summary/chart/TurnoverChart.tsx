import classnames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import styles from "./index.module.scss";
const cx = classnames.bind(styles);
function TurnoverChart() {

 
  

  const series: any = [
    {
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69],
    },
  ];

  const options: any = {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "#f3f3f3"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
      ],
    },
  };
  return (
    <>
      <span className={cx("turnover-dasboard-title")}>
        <div className="chart-icon"></div>Turnover Dashboard
      </span>

      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={500}
      ></ReactApexChart>
    </>
  );
}

export default TurnoverChart;
