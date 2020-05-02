import React from "react";
import Chart from "./Chart";

class TradeChart extends React.Component {
  state = {
    lineChartData: {
      labels: [],
      datasets: [
        {
          label: "BTC-USD",
          backgroundColor: "lightblue",
          borderColor: "red",
          pointBackgroundColor: "black",
          pointBorderColor: "green",
          borderWidth: "2",
          data: [],
        },
      ],
    },
    lineChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: true,
      },
      title: {
        display: true,
        text: "BTC-USD",
        fontSize: 20
    },
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
            },
          },
          {
            scaleLabel: {
              display: true,
              labelString: 'Time axis'
            }
          }
        ],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'USD equivalent of BTC'
          }
        }],
      },
    },
  };

  componentDidMount() {
    const subscribe = {
      type: "subscribe",
      channels: [
        {
          name: "ticker",
          product_ids: ["BTC-USD"],
        },
      ],
    };

    this.ws = new WebSocket("wss://ws-feed.gdax.com");

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify(subscribe));
    };

    this.ws.onmessage = (e) => {
      const response = JSON.parse(e.data);
      if (response.type !== "ticker") return;
      console.log("socket response: ", response);
      const oldData = this.state.lineChartData.datasets[0];
      const newData = { ...oldData };
      newData.data.push(response.price);

      const newChartData = {
        ...this.state.lineChartData,
        datasets: [newData],
        labels: this.state.lineChartData.labels.concat(
          new Date().toLocaleTimeString()
        ),
      };
      this.setState({ lineChartData: newChartData });
    };
  }

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    return (
      <div className="container p-2">
        <Chart
          data={this.state.lineChartData}
          options={this.state.lineChartOptions}
        />
      </div>
    );
  }
}

export default TradeChart;
