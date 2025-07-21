"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Subscription } from "@/lib/schemas/subscription";
import { Line } from "react-chartjs-2";
import { calculateMRR } from "@/lib/utils/financial";

interface ForecastingChartProps {
  subscriptions: Subscription[];
}

export function ForecastingChart({ subscriptions }: ForecastingChartProps) {
  const currentMRR = calculateMRR(subscriptions);
  
  // Generate 12-month forecast
  const forecast = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() + i);
    
    // Simple growth projection (5% monthly growth assumption)
    const projectedMRR = currentMRR * Math.pow(1.05, i);
    
    return {
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      amount: projectedMRR
    };
  });

  const data = {
    labels: forecast.map(f => f.month),
    datasets: [
      {
        label: 'Projected MRR',
        data: forecast.map(f => f.amount),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderDash: [5, 5],
        tension: 0.1,
      },
      {
        label: 'Current MRR',
        data: [currentMRR, ...Array(11).fill(null)],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        pointRadius: 6,
        showLine: false,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Expense Forecasting (5% Monthly Growth)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toFixed(0);
          }
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Forecasting</CardTitle>
      </CardHeader>
      <CardContent>
        <Line data={data} options={options} />
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Current MRR</p>
            <p className="text-lg font-semibold">${currentMRR.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">6-Month Projection</p>
            <p className="text-lg font-semibold">${forecast[5].amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">12-Month Projection</p>
            <p className="text-lg font-semibold">${forecast[11].amount.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}