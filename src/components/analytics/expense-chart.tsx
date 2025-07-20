"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscriptionStore } from "@/hooks/store/use-subscription-store";
import { Subscription } from "@/lib/schemas/subscription";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExpenseChartProps {
  title: string;
  description?: string;
}

export function ExpenseChart({ title, description }: ExpenseChartProps) {
  const { subscriptions } = useSubscriptionStore();
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [] as any[],
  });
  
  useEffect(() => {
    if (subscriptions.length === 0) return;
    
    // Get the next 6 months
    const months = [];
    const monthlyData = [];
    const today = new Date();
    
    for (let i = 0; i < 6; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push(month.toLocaleString("default", { month: "short", year: "2-digit" }));
      
      // Calculate expenses for this month
      const monthlyExpense = calculateMonthlyExpense(subscriptions, month);
      monthlyData.push(monthlyExpense);
    }
    
    setChartData({
      labels: months,
      datasets: [
        {
          label: "Monthly Expenses",
          data: monthlyData,
          backgroundColor: "rgba(37, 99, 235, 0.5)",
          borderColor: "rgb(37, 99, 235)",
          borderWidth: 1,
        },
      ],
    });
  }, [subscriptions]);
  
  // Calculate monthly expense based on subscriptions
  const calculateMonthlyExpense = (subscriptions: Subscription[], targetMonth: Date) => {
    return subscriptions.reduce((total, sub) => {
      const nextBillingDate = new Date(sub.nextBillingDate);
      
      // Check if subscription is billed in this month
      if (sub.billingCycle === "monthly") {
        return total + sub.amount;
      } else if (sub.billingCycle === "yearly") {
        // Check if yearly subscription renews this month
        const renewalMonth = nextBillingDate.getMonth();
        const renewalYear = nextBillingDate.getFullYear();
        
        if (
          renewalMonth === targetMonth.getMonth() &&
          renewalYear === targetMonth.getFullYear()
        ) {
          return total + sub.amount;
        }
        
        // Add monthly equivalent for yearly subscriptions
        return total + sub.amount / 12;
      } else if (sub.billingCycle === "quarterly") {
        // Check if quarterly subscription renews this month
        const monthDiff =
          (targetMonth.getFullYear() - nextBillingDate.getFullYear()) * 12 +
          targetMonth.getMonth() - nextBillingDate.getMonth();
        
        if (monthDiff % 3 === 0) {
          return total + sub.amount;
        }
        
        // Add monthly equivalent for quarterly subscriptions
        return total + sub.amount / 3;
      }
      
      return total;
    }, 0);
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return "$" + value;
          },
        },
      },
    },
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}