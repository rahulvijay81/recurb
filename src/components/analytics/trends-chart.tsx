"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Subscription } from "@/lib/schemas/subscription";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TrendsChartProps {
  subscriptions: Subscription[];
}

export function TrendsChart({ subscriptions }: TrendsChartProps) {
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      value: date
    };
  });

  const monthlyData = last12Months.map(({ month, value }) => {
    const monthlySpend = subscriptions.reduce((total, sub) => {
      const subDate = new Date(sub.createdAt || new Date());
      if (subDate <= value) {
        switch (sub.billingCycle) {
          case "monthly": return total + sub.amount;
          case "quarterly": return total + (sub.amount / 3);
          case "yearly": return total + (sub.amount / 12);
          default: return total;
        }
      }
      return total;
    }, 0);
    
    return { month, amount: monthlySpend };
  });

  const data = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Monthly Recurring Revenue',
        data: monthlyData.map(d => d.amount),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
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
        <CardTitle>Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <Line data={data} options={options} />
      </CardContent>
    </Card>
  );
}