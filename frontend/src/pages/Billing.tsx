import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { DollarSign, TrendingUp, CreditCard, PieChart } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface BillingData {
  current_hourly_rate: number;
  projected_monthly: number;
  breakdown: {
    Compute: number;
    Database: number;
    Network: number;
  };
  history: { day: string; cost: number }[];
}

export function Billing() {
  const [data, setData] = useState<BillingData | null>(null);

  useEffect(() => {
    fetchApi("/system/billing").then(setData).catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-text-tertiary">Loading billing data...</div>;

  const breakdownData = [
    { name: "Compute", cost: data.breakdown.Compute },
    { name: "Database", cost: data.breakdown.Database },
    { name: "Network", cost: data.breakdown.Network },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Billing & Usage</h1>
        <p className="text-text-secondary">Track your simulated AWS spending based on active containers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription>Current Run Rate</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              ${data.current_hourly_rate.toFixed(3)}<span className="text-sm font-normal text-text-secondary ml-1">/ hr</span>
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription>Projected Monthly</CardDescription>
            <CardTitle className="text-3xl flex items-center text-primary">
              ${data.projected_monthly.toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-border bg-primary/5">
          <CardHeader className="pb-2">
            <CardDescription>Current Invoice Status</CardDescription>
            <CardTitle className="text-xl flex items-center gap-2">
              <Badge variant="success">Active</Badge>
              <span className="text-sm text-text-secondary font-normal">Next bill: Aug 1st</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp size={18} className="text-info" /> 7-Day Spend History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121214', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                  />
                  <Line type="monotone" dataKey="cost" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4, fill: "#0ea5e9" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PieChart size={18} className="text-purple-400" /> Hourly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <YAxis dataKey="name" type="category" stroke="#e2e8f0" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <Tooltip 
                    cursor={{ fill: '#27272a' }}
                    contentStyle={{ backgroundColor: '#121214', borderColor: '#27272a', borderRadius: '8px' }}
                    formatter={(value: number) => [`$${value.toFixed(3)}/hr`, 'Rate']}
                  />
                  <Bar dataKey="cost" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Temporary inline Badge component to avoid fixing imports
function Badge({ children, variant = "default" }: any) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variants: any = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    success: "bg-success/20 text-success border border-success/30",
  };
  return <div className={`${base} ${variants[variant]}`}>{children}</div>;
}
