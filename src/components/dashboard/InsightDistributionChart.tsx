
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { InsightDistribution } from '@/data/mockData';

interface InsightDistributionChartProps {
  data: InsightDistribution[];
  title?: string;
  description?: string;
}

export function InsightDistributionChart({ 
  data, 
  title = "Insight Distribution", 
  description = "Breakdown of insight types by competitor" 
}: InsightDistributionChartProps) {
  const colors = {
    product: '#6366f1',
    hiring: '#ec4899',
    expansion: '#f59e0b',
    pricing: '#10b981',
    news: '#3b82f6',
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="competitor" />
            <YAxis />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="text-xs font-medium">{label}</div>
                      <div className="mt-1 grid gap-1">
                        {payload.map((entry, index) => (
                          <div key={`item-${index}`} className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-xs">
                              {entry.name}: {entry.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="product" stackId="a" fill={colors.product} name="Product Updates" />
            <Bar dataKey="hiring" stackId="a" fill={colors.hiring} name="Hiring Activity" />
            <Bar dataKey="expansion" stackId="a" fill={colors.expansion} name="Market Expansion" />
            <Bar dataKey="pricing" stackId="a" fill={colors.pricing} name="Pricing Changes" />
            <Bar dataKey="news" stackId="a" fill={colors.news} name="News & PR" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
