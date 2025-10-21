'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineGraphProps {
  data: any;
}

export default function LineGraph({ data }: LineGraphProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
  position: 'top' as const,
  labels: {
    color: document.documentElement.classList.contains('dark') ? '#e8edf7' : '#1d2449',
    font: {
      size: 12,
      weight: 600,
    },
  },
},
      tooltip: {
        backgroundColor: 'rgba(15, 17, 42, 0.9)',
        titleColor: '#b0efff',
        bodyColor: '#ffffff',
        borderColor: '#4105b6',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(65, 5, 182, 0.1)',
        },
        ticks: {
          color: '#1d2449',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#1d2449',
        },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Line options={options} data={data} />
    </div>
  );
}