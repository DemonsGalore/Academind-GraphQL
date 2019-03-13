import React from 'react';
import { Bar } from 'react-chartjs-2';

import './BookingsChart.css';

const BOOKINGS_BUCKETS = {
  'Cheap': {
    min: 0,
    max: 100
  },
  'Normal': {
    min: 100,
    max: 200
  },
  'Expensive': {
    min: 200,
    max: 1000000
  }
};

const bookingChart = props => {
  const chartData = {labels: [], datasets: []};
  let values = [];
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (current.event.price > BOOKINGS_BUCKETS[bucket].min && current.event.price <= BOOKINGS_BUCKETS[bucket].max) {
        return prev + 1;
      } else {
        return prev;
      }

    }, 0);
    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      backgroundColor: 'rgba(4,167,119,0.2)',
      borderColor: 'rgba(4,167,119,1)',
      // borderWidth: 1,
      hoverBackgroundColor: 'rgba(4,167,119,0.4)',
      hoverBorderColor: 'rgba(4,167,119,1)',
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
  }

  return <div className="chart-container"><Bar data={chartData}/></div>;
};

export default bookingChart;
