
import { getDashboardData } from "api/admin";
import { Col, Row } from "antd";
import AdminLayout from "components/Layout/AdminLayout";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";





const Dashboard = () => {

  const [apicall, setApicall] = useState(false)
  const [totalRooms, setTotalRooms] = useState(0)
  const [totalContracts, setTotalContracts] = useState(0)
  const [totalAccounts, setTotalAccounts] = useState(0)
  const [contractSeriesData, setContractSeriesData] = useState([])
  const [contractOptionXCategory, setContractOptionXCategory] = useState([])
  const [contractPieSeriesData, setContractPieSeriesData] = useState([])
  const [contractPieOptionXCategory, setContractPieOptionXCategory] = useState([])


  let dashboardCard = [
    {
      title: "Total Rooms",
      color: "#00bfb9",
      total: totalRooms,
      icon: "admin-room-icon"
    },
    {
      title: "Total Contracts",
      color: "#3e70ff",
      total: totalContracts,
      icon: "admin-contract-icon"
    },
    {
      title: "Total Accounts",
      color: "#9A01ED",
      total: totalAccounts,
      icon: "admin-account-icon"
    },
  ]



  let contractSeries: any = [{
    name: 'Contract',
    data: contractSeriesData,
  }]

  let contractOptions: any = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    title: {
      text: "Total Contracts By Month",
      style: {
        fontSize: '24px',
        fontWeight: 'bold',
        fontFamily: undefined,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: contractOptionXCategory
    },
    yaxis: {
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val
        }
      }
    }
  }


  let contractPieSeries: any = contractPieSeriesData
  let ContractPieOptions: any = {
    chart: {
      width: 280,
      type: 'pie',
      toolbar: {
        show: true,
      }
    },
    title: {
      text: "Total Contracts By Status",
      style: {
        fontSize: '24px',
        fontWeight: 'bold',
        fontFamily: undefined,
      },
    },
    legend: {
      position: 'right',
      horizontalAlign: 'center',
      offsetY: 100
    },
    labels: contractPieOptionXCategory,
    responsive: [{
      breakpoint: 280,
      options: {
        chart: {
          width: 100
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
  }

  useEffect(() => {
    getDashboardData().then((res: any) => {
      setTotalRooms(res.totalRoom)
      setTotalContracts(res.totalContract)
      setTotalAccounts(res.totalAccount)
      setContractSeriesData(res.monthContract.contractCount)
      setContractOptionXCategory(res.monthContract.month)
      setContractPieSeriesData(res.statusContract.countContract)
      setContractPieOptionXCategory(res.statusContract.statusName)
      setApicall(true)
    })
  }, [])

  return (
    <AdminLayout>
      <Row style={{ textAlign: "left" }}>
        <Col span={24} style={{ fontWeight: "bold", fontSize: "24px", marginBottom: "24px" }}>Dashboard</Col>
        <Col span={24}>
          <Row>
            {dashboardCard.map((item: any, index: any) => (
              <Col key={index} span={8} style={{ paddingLeft: "8px", paddingRight: "8px" }}>
                <Row>
                  <Col span={24} style={{ border: `2px solid ${item.color}`, height: "160px", paddingBottom: "48px", paddingTop: "48px", borderRadius: "6px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}>
                    <Row style={{ display: "flex", justifyContent: "center" }}>
                      <Col span={18} style={{ display: "flex" }}>
                        <Row style={{ paddingLeft: "32px" }}>
                          <Col span={24} style={{ fontSize: "24px", fontWeight: "bold", color: `${item.color}` }}>
                            {item.title}
                          </Col>
                          <Col span={24} style={{ fontSize: "20px", fontWeight: "bold" }}>
                            {item.total}
                          </Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <div className={`${item.icon}`}></div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={24} style={{ marginTop: "60px" }}>
          {apicall && <Row>
            <Col span={12} style={{ paddingLeft: "4px", paddingRight: "4px" }}>
              <Row>
                <Col span={24} style={{ paddingLeft: "12px", paddingRight: "12px", border: "1px solid #ccc", borderRadius: "4px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)", paddingTop: "12px", paddingBottom: "8px" }}>
                  <Row>
                    <Col span={24}>
                      {apicall && <ReactApexChart
                        options={contractOptions}
                        series={contractSeries}
                        type="bar"
                        height={300}
                        width={640}
                      />}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col span={12} style={{ paddingLeft: "4px", paddingRight: "4px" }}>
              <Row>
                <Col span={24} style={{ paddingLeft: "12px", paddingRight: "12px", border: "1px solid #ccc", borderRadius: "4px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)", paddingTop: "12px", paddingBottom: "8px" }}>
                  <Row>
                    <Col span={24}>
                      <ReactApexChart
                        options={ContractPieOptions}
                        series={contractPieSeries}
                        type="pie"
                        height={312}
                        width={640}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>}
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default Dashboard;
