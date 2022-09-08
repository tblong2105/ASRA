import classnames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import styles from "./index.module.scss";

const cx = classnames.bind(styles);
function ContractChart() {
  const series: any = [
    {
      name: "High - 2013",
      data: [28, 29, 33, 36, 32, 32, 33],
    },
    {
      name: "Low - 2013",
      data: [12, 11, 14, 18, 17, 13, 13],
    },
  ];

  const options: any = {
    chart: {
      height: 350,
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#77B6EA", "#545454"],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "straight",
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "#f3f3f3"],
        opacity: 0.5,
      },
    },
    markers: {
      size: 1,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    yaxis: {
      min: 5,
      max: 40,
    },
    legend: {
      show: true,
      showForSingleSeries: false,
      showForNullSeries: true,
      showForZeroSeries: true,
      position: "top",
      horizontalAlign: "right",
      floating: false,
      fontSize: "14px",
      fontFamily: "Helvetica, Arial",
      fontWeight: 400,
      formatter: undefined,
      inverseOrder: false,
      width: undefined,
      height: undefined,
      tooltipHoverFormatter: undefined,
      customLegendItems: [],
      offsetX: 0,
      offsetY: 0,
      labels: {
        colors: undefined,
        useSeriesColors: false,
      },
      markers: {
        width: 12,
        height: 12,
        strokeWidth: 0,
        strokeColor: "#fff",
        fillColors: undefined,
        radius: 12,
        customHTML: undefined,
        onClick: undefined,
        offsetX: 0,
        offsetY: 0,
      },
      itemMargin: {
        horizontal: 5,
        vertical: 0,
      },
      onItemClick: {
        toggleDataSeries: true,
      },
      onItemHover: {
        highlightDataSeries: true,
      },
    },
  };

  return (
    <>
      <span className={cx("turnover-dasboard-title")}>
        <div className="chart-icon"></div>Contract Dashboard
      </span>

      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </>
  );
}

export default ContractChart;
